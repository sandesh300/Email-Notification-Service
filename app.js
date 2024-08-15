const express = require('express');
require('dotenv').config();

const { sendNotification } = require('./controllers/notificationController');

const app = express();

app.use(express.json());

app.post('/send-notification', sendNotification);

module.exports = app;
