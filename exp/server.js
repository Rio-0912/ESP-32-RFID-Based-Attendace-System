// server.js - Express server
const express = require('express');
const cors = require('cors');
const db = require('./db');
const login = require('./controllers/login');
const getDashboardStats = require('./controllers/dashboard');
const getCalendarEvents = require('./controllers/calendar');
const getLectureAnalytics = require('./controllers/lectures');
const sendMail = require('./mailer');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Helper function to promisify db queries
function queryPromise(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// Endpoint to receive RFID scan from ESP32
app.post('/data', async (req, res) => {
    try {
        const { card_id } = req.body;

        // Lookup student by RFID
        const studentQuery = 'SELECT uid, name, email FROM student WHERE rfid = ?';
        const students = await queryPromise(studentQuery, [card_id]);

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student = students[0];
        const now = new Date();
        
        // Convert to IST (UTC+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);
        const currentHour = istTime.getUTCHours();
        const currentMinute = istTime.getUTCMinutes();
        const today = istTime.toISOString().split('T')[0]; // YYYY-MM-DD

        console.log(`\n📍 RFID Scan received at IST: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
        console.log(`👤 Student: ${student.name} (UID: ${student.uid})`);

        // Get all timetable lectures
        const timetable = await queryPromise('SELECT * FROM timetable ORDER BY start_time');
        
        let lectureToMark = null;

        // Check if current time matches any lecture time
        for (const lecture of timetable) {
            if (currentHour >= lecture.start_time && currentHour < lecture.end_time) {
                lectureToMark = lecture;
                console.log(`✅ Current time matches: ${lecture.cname} (${lecture.start_time}:00 - ${lecture.end_time}:00)`);
                break;
            }
        }

        // If no matching lecture found, find oldest missed lecture
        if (!lectureToMark) {
            console.log('⚠️ No lecture currently in session. Checking for missed lectures...');
            
            const collegeStartDate = new Date('2025-10-10');
            
            // Get all dates from college start to today (weekdays only)
            const missedLectures = [];
            for (let d = new Date(collegeStartDate); d <= istTime; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
                
                const dateStr = d.toISOString().split('T')[0];
                
                // For each lecture, check if attended
                for (const lecture of timetable) {
                    const attendanceCheck = await queryPromise(
                        'SELECT * FROM attendance WHERE uid = ? AND date = ? AND name = ?',
                        [student.uid, dateStr, lecture.cname]
                    );
                    
                    if (attendanceCheck.length === 0) {
                        // This lecture was missed
                        missedLectures.push({
                            date: dateStr,
                            lecture: lecture,
                            timestamp: new Date(dateStr + 'T' + lecture.start_time.toString().padStart(2, '0') + ':00:00')
                        });
                    }
                }
            }

            if (missedLectures.length > 0) {
                // Sort by timestamp (oldest first)
                missedLectures.sort((a, b) => a.timestamp - b.timestamp);
                const oldest = missedLectures[0];
                
                console.log(`📚 Marking oldest missed lecture: ${oldest.lecture.cname} from ${oldest.date}`);
                
                // Mark attendance for the oldest missed lecture
                await queryPromise(
                    'INSERT INTO attendance (date, name, uid) VALUES (?, ?, ?)',
                    [oldest.date, oldest.lecture.cname, student.uid]
                );

                // Send email notification
                await sendAttendanceEmail(student, oldest.lecture, oldest.date);

                return res.json({
                    message: `Attendance recorded for ${student.name}`,
                    lecture: oldest.lecture.cname,
                    date: oldest.date,
                    note: 'Marked oldest missed lecture'
                });
            } else {
                console.log('✅ All lectures are up to date. No action needed.');
                return res.json({
                    message: `No pending attendance for ${student.name}`,
                    note: 'All lectures are already marked'
                });
            }
        }

        // Check if already marked for today's lecture
        const existingAttendance = await queryPromise(
            'SELECT * FROM attendance WHERE uid = ? AND date = ? AND name = ?',
            [student.uid, today, lectureToMark.cname]
        );

        if (existingAttendance.length > 0) {
            console.log('ℹ️ Attendance already marked for this lecture today.');
            return res.json({
                message: `Attendance already marked for ${student.name}`,
                lecture: lectureToMark.cname,
                note: 'Already present'
            });
        }

        // Mark attendance for current lecture
        await queryPromise(
            'INSERT INTO attendance (date, name, uid) VALUES (?, ?, ?)',
            [today, lectureToMark.cname, student.uid]
        );

        console.log(`✅ Attendance marked successfully!`);

        // Send email notification
        await sendAttendanceEmail(student, lectureToMark, today);

        res.json({
            message: `Attendance recorded for ${student.name}`,
            lecture: lectureToMark.cname,
            date: today
        });

    } catch (error) {
        console.error('❌ Error processing attendance:', error);
        res.status(500).json({ error: 'Failed to process attendance' });
    }
});

// Helper function to send attendance email
async function sendAttendanceEmail(student, lecture, date) {
    try {
        // Calculate student's stats
        const collegeStartDate = new Date('2025-10-10');
        const today = new Date();
        
        // Calculate working days
        let workingDays = 0;
        for (let d = new Date(collegeStartDate); d <= today; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
        }
        
        // Get total lectures and attended count
        const [lectureCount] = await queryPromise('SELECT COUNT(*) as total FROM timetable');
        const totalPossible = workingDays * lectureCount.total;
        
        const [attendedResult] = await queryPromise(
            'SELECT COUNT(*) as attended FROM attendance WHERE uid = ?',
            [student.uid]
        );
        const attended = attendedResult.attended;
        const attendanceRate = Math.round((attended / totalPossible) * 100);
        
        // Calculate streak
        const streakDates = await queryPromise(
            'SELECT DISTINCT date FROM attendance WHERE uid = ? ORDER BY date DESC',
            [student.uid]
        );
        
        let streak = 0;
        if (streakDates.length > 0) {
            streak = 1;
            for (let i = 0; i < streakDates.length - 1; i++) {
                const date1 = new Date(streakDates[i].date);
                const date2 = new Date(streakDates[i + 1].date);
                const diffDays = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
                if (diffDays === 1 || (diffDays <= 3 && date2.getDay() === 5)) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        
        // Format date and time
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = `${lecture.start_time.toString().padStart(2, '0')}:00 - ${lecture.end_time.toString().padStart(2, '0')}:00`;
        
        // Send email
        await sendMail(
            student.email,
            'Attendance Confirmed ✓',
            student.name,
            lecture.cname,
            formattedDate,
            formattedTime,
            attendanceRate,
            streak
        );
        
        console.log(`📧 Email sent to ${student.email}`);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        // Don't throw - email failure shouldn't break attendance marking
    }
}

app.post('/login', login)

// Dashboard stats endpoint
app.get('/dashboard', getDashboardStats)

// Calendar events endpoint
app.get('/calendar', getCalendarEvents)

// Lecture analytics endpoint
app.get('/lectures', getLectureAnalytics)

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
