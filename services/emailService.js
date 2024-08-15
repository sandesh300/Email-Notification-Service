const nodemailer = require('nodemailer');
const { primary } = require('../config/emailConfig');

const primaryTransporter = nodemailer.createTransport(primary);

const sendEmail = async (to, subject, text) => {
    try {
        const info = await primaryTransporter.sendMail({
            from: primary.auth.user,
            to,
            subject,
            text,
        });
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
