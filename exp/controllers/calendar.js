const db = require("../db");

const getCalendarEvents = async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // College started on Oct 10, 2025
    const collegeStartDate = new Date('2025-10-10');

    // Get all lectures from timetable
    const timetable = await queryPromise("SELECT * FROM timetable ORDER BY start_time");

    // Get user's attendance records
    const attendance = await queryPromise(
      `SELECT date, name 
       FROM attendance 
       WHERE uid = ?`,
      [uid]
    );

    // Create a map of attended lectures by date
    const attendanceMap = {};
    attendance.forEach(record => {
      const dateStr = new Date(record.date).toISOString().split('T')[0];
      if (!attendanceMap[dateStr]) {
        attendanceMap[dateStr] = [];
      }
      attendanceMap[dateStr].push(record.name);
    });

    // Generate events from college start date to 2 months ahead
    const events = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(collegeStartDate);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 2);

    // Iterate through dates and create events for weekdays only
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      const dateStr = new Date(d).toISOString().split('T')[0];
      const currentDate = new Date(d);
      currentDate.setHours(0, 0, 0, 0);
      
      const isPast = currentDate < today;
      const isToday = dateStr === today.toISOString().split('T')[0];

      // Create an event for each lecture in the timetable (all 8 lectures)
      timetable.forEach(lecture => {
        const attended = attendanceMap[dateStr]?.includes(lecture.cname);
        
        let status;
        if (isPast && !isToday) {
          status = attended ? 'attended' : 'missed';
        } else {
          status = 'upcoming';
        }

        events.push({
          id: `${lecture.cid}-${dateStr}`,
          title: lecture.cname,
          date: dateStr,
          startTime: `${lecture.start_time.toString().padStart(2, '0')}:00`,
          endTime: `${lecture.end_time.toString().padStart(2, '0')}:00`,
          status,
          cid: lecture.cid,
        });
      });
    }

    res.json({ events });
  } catch (error) {
    console.error("Calendar events error:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};

// Helper function to promisify database queries
function queryPromise(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

module.exports = getCalendarEvents;
