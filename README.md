# Resilient Email Sending Service

This project implements a resilient email sending service with retry logic, fallback mechanism, rate limiting, and circuit breaker pattern.

## Features

- Retry mechanism with exponential backoff
- Fallback between primary and secondary email providers
- Idempotency using unique email IDs
- Rate limiting
- Status tracking for email sending attempts
- Circuit breaker pattern
- Simple logging

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run the application: `npm start`
5. Run tests: `npm test`

## Assumptions

- The email providers are mocked for demonstration purposes
- The rate limit is set to 10 emails per second
- The circuit breaker opens after 5 consecutive failures and resets after 60 seconds
- Exponential backoff is used for retries

## Usage

```typescript
import { EmailService } from './services/EmailService';
import { MockEmailProvider } from './services/MockEmailProvider';

const primaryProvider = new MockEmailProvider('Primary Provider');
const secondaryProvider = new MockEmailProvider('Secondary Provider');

const emailService = new EmailService(primaryProvider, secondaryProvider, 10, 1000);

async function sendEmail() {
  const emailId = await emailService.sendEmail({
    to: 'example@example.com',
    subject: 'Test Email',
    body: 'This is a test email',
  });

  console.log(`Email sent with ID: ${emailId}`);

  // Check status after 5 seconds
  setTimeout(async () => {
    const status = await emailService.getEmailStatus(emailId);
    console.log(`Email status: ${JSON.stringify(status)}`);
  }, 5000);
}

sendEmail().catch(console.error);
