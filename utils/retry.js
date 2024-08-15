const nodemailer = require('nodemailer');

// Setup primary email transporter using environment variables
const primaryTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.PRIMARY_EMAIL,
        pass: process.env.PRIMARY_EMAIL_PASSWORD
    }
});

// Setup backup email transporter using environment variables
const backupTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.BACKUP_EMAIL,
        pass: process.env.BACKUP_EMAIL_PASSWORD
    }
});

const sendWithRetry = async (to, subject, html) => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            await primaryTransporter.sendMail({ from: process.env.PRIMARY_EMAIL, to, subject, html });
            console.log("Email sent successfully via primary transporter");
            return; // Exit after successful email sending
        } catch (error) {
            attempts++;
            console.error(`Retry attempt ${attempts} failed. Error: ${error.message}`);
            if (attempts >= maxAttempts) {
                console.log("Switching to backup transporter after failed attempts with primary transporter");
                try {
                    await backupTransporter.sendMail({ from: process.env.BACKUP_EMAIL, to, subject, html });
                    console.log("Email sent successfully via backup transporter");
                    return; // Exit after successful email sending with backup transporter
                } catch (backupError) {
                    console.error(`Failed to send email using backup transporter: ${backupError.message}`);
                    throw backupError; // Rethrow the error after backup transporter failure
                }
            }
        }
    }
};

module.exports = { sendWithRetry };
