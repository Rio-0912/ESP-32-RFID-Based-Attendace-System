const db = require("../db");

const getLectureAnalytics = async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // College started on Oct 10, 2025
    const collegeStartDate = new Date('2025-10-10');
    const today = new Date();
    
    // Calculate working days (Mon-Fri) from college start to today
    let workingDays = 0;
    for (let d = new Date(collegeStartDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        workingDays++;
      }
    }

    // Get all lectures from timetable
    const timetable = await queryPromise("SELECT * FROM timetable ORDER BY start_time");

    // Get user's attendance grouped by lecture name
    const attendance = await queryPromise(
      `SELECT name, COUNT(*) as attended 
       FROM attendance 
       WHERE uid = ? 
       GROUP BY name`,
      [uid]
    );

    // Create a map of attendance by lecture name
    const attendanceMap = {};
    attendance.forEach(record => {
      attendanceMap[record.name] = record.attended;
    });

    // Calculate analytics for each lecture
    const lectureAnalytics = timetable.map(lecture => {
      const attended = attendanceMap[lecture.cname] || 0;
      const total = workingDays; // Each lecture happens once per working day
      const missed = total - attended;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

      return {
        cid: lecture.cid,
        name: lecture.cname,
        attended,
        total,
        missed,
        percentage,
        startTime: `${lecture.start_time.toString().padStart(2, '0')}:00`,
        endTime: `${lecture.end_time.toString().padStart(2, '0')}:00`,
      };
    });

    res.json({ lectures: lectureAnalytics });
  } catch (error) {
    console.error("Lecture analytics error:", error);
    res.status(500).json({ error: "Failed to fetch lecture analytics" });
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

module.exports = getLectureAnalytics;
