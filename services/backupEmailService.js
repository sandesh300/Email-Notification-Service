const nodemailer = require('nodemailer');
const { backup } = require('../config/emailConfig');

const backupTransporter = nodemailer.createTransport(backup);

const sendBackupEmail = async (to, subject, text) => {
    try {
        const info = await backupTransporter.sendMail({
            from: backup.auth.user,
            to,
            subject,
            text,
        });
        console.log('Backup email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Failed to send backup email:', error);
        throw error;
    }
};

module.exports = { sendBackupEmail };
