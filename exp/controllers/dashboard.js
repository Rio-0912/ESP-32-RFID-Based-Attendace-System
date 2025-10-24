const db = require("../db");

const getDashboardStats = async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // College started on Oct 10, 2025
    const collegeStartDate = new Date('2025-10-10');
    const today = new Date();
    
    // Get total lectures from timetable (8 lectures per day)
    const [totalLectures] = await queryPromise("SELECT COUNT(*) as total FROM timetable");
    const totalLecturesPerDay = totalLectures.total; // 8
    
    // Calculate working days (Mon-Fri) from college start to today
    let workingDays = 0;
    for (let d = new Date(collegeStartDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        workingDays++;
      }
    }
    
    // Total possible lectures = working days * lectures per day
    const totalPossibleLectures = workingDays * totalLecturesPerDay;
    
    // Get actual attended lectures count
    const [attendedResult] = await queryPromise(
      "SELECT COUNT(*) as attended FROM attendance WHERE uid = ?",
      [uid]
    );
    const attendedCount = attendedResult.attended;
    
    // Calculate overall attendance percentage
    const overallAttendance = totalPossibleLectures > 0 
      ? Math.round((attendedCount / totalPossibleLectures) * 100) 
      : 0;
    
    // Get this month's lectures
    const [thisMonth] = await queryPromise(
      `SELECT COUNT(*) as thisMonth 
       FROM attendance 
       WHERE uid = ? 
       AND MONTH(date) = MONTH(CURRENT_DATE()) 
       AND YEAR(date) = YEAR(CURRENT_DATE())`,
      [uid]
    );
    
    // Get most attended subject
    const [mostAttended] = await queryPromise(
      `SELECT name, COUNT(*) as count 
       FROM attendance 
       WHERE uid = ? 
       GROUP BY name 
       ORDER BY count DESC 
       LIMIT 1`,
      [uid]
    );
    
    // Calculate streak (consecutive working days with at least one attendance)
    const streakDates = await queryPromise(
      `SELECT DISTINCT date 
       FROM attendance 
       WHERE uid = ? 
       ORDER BY date DESC`,
      [uid]
    );
    
    let currentStreak = 0;
    if (streakDates.length > 0) {
      const lastAttendance = new Date(streakDates[0].date);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      lastAttendance.setHours(0, 0, 0, 0);
      
      // Check if last attendance was today or yesterday (accounting for weekends)
      const daysDiff = Math.floor((todayDate - lastAttendance) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 3) { // Within 3 days to account for weekends
        currentStreak = 1;
        
        for (let i = 0; i < streakDates.length - 1; i++) {
          const date1 = new Date(streakDates[i].date);
          const date2 = new Date(streakDates[i + 1].date);
          date1.setHours(0, 0, 0, 0);
          date2.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
          
          // Count as streak if difference is 1 day or up to 3 days (skipping weekends)
          if (diffDays === 1 || (diffDays <= 3 && date2.getDay() === 5)) { // Friday to Monday
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    // Prepare response
    const stats = {
      overallAttendance,
      totalLectures: totalPossibleLectures,
      attendedLectures: attendedCount,
      missedLectures: totalPossibleLectures - attendedCount,
      thisMonthLectures: thisMonth.thisMonth,
      currentStreak,
      mostAttendedSubject: mostAttended ? mostAttended.name : "N/A",
      mostAttendedCount: mostAttended ? mostAttended.count : 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
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

module.exports = getDashboardStats;
