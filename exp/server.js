// server.js - Express server
const express = require('express');
const cors = require('cors');
const db = require('./db');
const login = require('./controllers/login');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Endpoint to receive RFID scan from ESP32
app.post('/data', (req, res) => {
    const { card_id } = req.body;

    // Lookup student by RFID
    const query = 'SELECT uid, name FROM student WHERE rfid = ?';
    db.query(query, [card_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student = results[0];
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Insert attendance for this student
        const attendanceQuery = 'INSERT INTO attendance (date, name, uid) VALUES (?, ?, ?)';
        const lectureName = 'Example Lecture'; // You can replace this with dynamic logic if needed
        db.query(attendanceQuery, [today, lectureName, student.uid], (err2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ error: 'Failed to insert attendance' });
            }

            res.json({ message: `Attendance recorded for ${student.name}` });
        });
    });
});

app.post('/login', login)

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
