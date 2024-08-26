
# Resilient Email Sending Service

A robust and resilient email sending service implemented in TypeScript/Node.js.

## Features

- Retry mechanism with exponential backoff
- Fallback between primary and secondary email providers
- Idempotency through unique email IDs
- Rate limiting to prevent overwhelming email providers
- Circuit breaker pattern to handle temporary service outages
- Queue system for failed emails to retry later
- Detailed logging and performance metrics

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-username/resilient-email-service.git
   cd resilient-email-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Run the application:
   ```
   npm start
   ```

5. Run tests:
   ```
   npm test
   ```

## Configuration

The service can be configured by modifying the following files:

- `src/index.ts`: Main entry point, configure email providers and service parameters
- `src/services/EmailService.ts`: Core email service logic
- `src/services/MockEmailProvider.ts`: Mock email provider for testing

## Usage

To send an email:

```typescript
const emailService = new EmailService(primaryProvider, secondaryProvider, 10, 1000);

const emailId = await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Test Email',
  body: 'This is a test email'
});

console.log(`Email sent with ID: ${emailId}`);

// Check email status
const status = await emailService.getEmailStatus(emailId);
console.log(`Email status: ${JSON.stringify(status, null, 2)}`);
```

## Assumptions

1. Email Providers:
   - The service uses mock email providers for demonstration purposes.
   - In a production environment, these would be replaced with actual email service integrations.

2. Rate Limiting:
   - The rate limiter is set to 10 emails per second by default.
   - This can be adjusted based on the actual limits of your email providers.

3. Circuit Breaker:
   - The circuit breaker opens after 5 consecutive failures.
   - It auto-resets after 60 seconds in the open state.

4. Retry Mechanism:
   - The service attempts to send an email up to 3 times before marking it as failed.
   - There's an exponential backoff between retry attempts.

5. Fallback Mechanism:
   - The service switches to the secondary provider after 2 failed attempts with the primary provider.

6. Queue System:
   - Failed emails are added to a queue for later retry.
   - The queue is in-memory and not persistent. In a production environment, consider using a persistent queue.

7. Logging:
   - The service uses console logging. In a production environment, replace this with a proper logging solution.

8. Error Handling:
   - The service catches and logs errors but doesn't implement advanced error reporting.

9. Scalability:
   - The current implementation is designed for a single instance. For a distributed system, consider using distributed locking and a shared queue.

10. Security:
    - The service doesn't implement authentication or encryption. These should be added for a production environment.

## Metrics

The service provides basic performance metrics:

- Success rate of email sending attempts
- Average number of attempts per email
- Current state of the circuit breaker

Access these metrics using the `getMetrics()` and `getCircuitBreakerState()` methods of the `EmailService` class.

## Future Improvements

- Implement persistent storage for the email queue
- Add more comprehensive logging and monitoring
- Implement actual email provider integrations
- Add authentication and encryption for security
- Implement a web interface for monitoring and manual retries

