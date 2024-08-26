
# Resilient Email Service

A robust and fault-tolerant email sending service built with TypeScript and Node.js. This service implements advanced error handling techniques, including retry mechanisms, fallback providers, rate limiting, and circuit breaking.

## Features

- **Retry Mechanism**: Automatically retries failed email sending attempts with exponential backoff.
- **Fallback Mechanism**: Switches to a secondary email provider if the primary provider fails consistently.
- **Rate Limiting**: Prevents overwhelming email providers by limiting the rate of email sending.
- **Circuit Breaker**: Temporarily disables the email sending functionality if too many failures occur, preventing system overload.
- **Idempotency**: Uses unique IDs for each email to prevent duplicate sends.
- **Queue System**: Failed emails are added to a queue for later retry.
- **Detailed Logging**: Comprehensive logging of all email sending attempts and their outcomes.
- **Performance Metrics**: Tracks success rates and average attempts per email.

## Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resilient-email-service.git
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

## Usage

1. Configure the email providers in `src/index.ts`:
   ```typescript
   const primaryProvider = new MockEmailProvider('Primary Provider', 0.5, 3);
   const secondaryProvider = new MockEmailProvider('Secondary Provider', 0.2);
   ```

2. Run the application:
   ```
   npm start
   ```

3. The application will send test emails and display the results, including success rates and performance metrics.

## Configuration

- Adjust the rate limiting parameters in `src/services/EmailService.ts`:
  ```typescript
  this.rateLimiter = new RateLimiter(10, 1000); // 10 emails per second
  ```

- Modify the circuit breaker settings in `src/services/EmailService.ts`:
  ```typescript
  this.circuitBreaker = new CircuitBreaker(5, 60000); // Opens after 5 failures, resets after 60 seconds
  ```

## Testing

Run the test suite with:
```
npm test
```

## Project Structure

- `src/services/`: Contains core service classes (EmailService, MockEmailProvider, etc.)
- `src/utils/`: Utility classes like CircuitBreaker and Logger
- `src/interfaces/`: TypeScript interfaces
- `src/types/`: Custom type definitions
- `tests/`: Unit and integration tests
