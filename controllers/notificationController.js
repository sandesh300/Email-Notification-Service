const { sendWithRetry } = require('../utils/retry');
const { v4: uuidv4 } = require('uuid');

const sendNotification = async (req, res) => {
    const { from, to, subject, html } = req.body;

    try {
        // Attempt to send the email with retry logic
        await sendWithRetry(to, subject, html);

        // Generate a unique ID for the email
        const emailId = `${uuidv4()}@sandbox593c3fb39bfa4e57adc55ab8ad0a1.maigum.args`;

        // Construct the response
        const response = {
            status: "success",
            channels: {
                email: {
                    Id: emailId,
                    providerId: "email-sailgın-provider"
                }
            }
        };

        // Send the successful response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error during email sending:', error);

        // Send an error response
        res.status(500).json({
            status: "failure",
            message: 'Failed to send email due to an unexpected error.',
            error: error.message
        });
    }
};

module.exports = { sendNotification };
