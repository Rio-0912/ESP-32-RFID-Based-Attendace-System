const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

// ✅ Load HTML file as plain text
const source = fs.readFileSync(path.join(__dirname, 'mail.html'), 'utf8');
const template = handlebars.compile(source);
// ✅ Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'jaipurdaires@gmail.com', // must be a full Gmail address
        pass: 'bqrfgvulbuudjlye'       // app password, not your Gmail password
    }
});

// ✅ Function to send mail
async function sendMail(to, subject, name, course_name, date, time, attendance_rate, streak) {
    const htmlContent = template({
        name,
        course_name,
        date,
        time,
        attendance_rate,
        streak
    })
    try {
        await transporter.sendMail({
            from: '"Attendace System" <jaipurdaires@gmail.com>',
            to,
            subject,
            html: htmlContent
        });
        console.log('✅ Mail sent successfully!');
    } catch (error) {
        console.error('❌ Error sending mail:', error);
    }
}

// Export the module
module.exports = sendMail;
