const nodemailer = require('nodemailer');

const backupTransporter = nodemailer.createTransport({
    service: 'gmail', // or any other backup service provider
    auth: {
        user: process.env.BACKUP_EMAIL_USER,
        pass: process.env.BACKUP_EMAIL_PASS
    }
});

module.exports = { backupTransporter };
