const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables

(async () => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Gmail's SMTP host
        port: process.env.EMAIL_PORT, // Port for TLS
        secure: false, // Use false because we are using STARTTLS
        auth: {
            user: process.env.EMAIL_USER, // Gmail email address
            pass: process.env.EMAIL_PASS, // App password
        },
        logger: true, // Enable logging for debugging
        debug: true,  // Enable debugging output
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Your Gmail address
        to: 'devdshah2311@gmail.com', // Replace with recipient email
        subject: 'Test Email from Gmail SMTP',
        text: 'This is a test email sent using Gmail SMTP.',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
})();
