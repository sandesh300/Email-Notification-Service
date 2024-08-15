Here's a sample `README.md` file for your notification service application in Node.js:

```markdown
# Notification Service with Retry Logic

This Node.js application is a notification service that sends emails with retry logic and switches to a backup email service after three consecutive failures. The service is built using `Express.js` and `Nodemailer`.

## Features

- **Retry Logic:** Automatically retries email delivery up to 3 times on failure.
- **Backup Service:** Switches to a backup email service if the primary one fails.
- **Environment Configuration:** All sensitive information (email credentials) is stored in a `.env` file.
- **RESTful API:** Exposes an API endpoint to send emails with specified parameters.

## Prerequisites

- Node.js (v14 or above)
- NPM or Yarn

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/notification-service.git
    cd notification-service
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=3000

    PRIMARY_EMAIL=your_primary_email@gmail.com
    PRIMARY_EMAIL_PASSWORD=your_primary_email_password

    BACKUP_EMAIL=your_backup_email@gmail.com
    BACKUP_EMAIL_PASSWORD=your_backup_email_password
    ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

    The server will start running on `http://localhost:3000`.

2. Send an email by making a POST request to `http://localhost:3000/send-email` with the following JSON body:

    ```json
    {
        "from": "sandeshbhujbal007@gmail.com",
        "to": "sanketkatke100@gmail.com",
        "subject": "Test email",
        "html": "<h1>This is the test email.</h1>"
    }
    ```

3. The API will respond with a JSON object similar to the following:

    ```json
  {
    "status": "success",
    "channels": {
        "email": {
            "Id": "aa67b0a3-e599-4a14-865b-68cb657870c6@sandbox593c3fb39bfa4e57adc55ab8ad0a1.maigum.args",
            "providerId": "email-sailgın-provider"
        }
    }
}
    ```

## File Structure

```plaintext
├── app.js                   # Initializes the Express app and sets up middleware
├── server.js                # Starts the Express server
├── controllers
│   └── notificationController.js  # Handles the email sending logic
├── utils
│   ├── retry.js             # Contains the retry logic for email delivery
│   ├── primaryTransporter.js # Sets up the primary email transporter
│   └── backupTransporter.js  # Sets up the backup email transporter
├── .env                     # Environment variables
├── .gitignore               # Files and directories to be ignored by Git
└── package.json             # Project metadata and dependencies
```

