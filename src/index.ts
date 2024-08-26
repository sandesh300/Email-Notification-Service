
import { EmailService } from './services/EmailService';
import { MockEmailProvider } from './services/MockEmailProvider';
import { Logger } from './utils/Logger';

const primaryProvider = new MockEmailProvider('Primary Provider', 0.5, 3);
const secondaryProvider = new MockEmailProvider('Secondary Provider', 0.2);

const emailService = new EmailService(primaryProvider, secondaryProvider, 10, 1000);

async function sendTestEmail(subject: string) {
  const emailId = await emailService.sendEmail({
    to: 'bhujbalsandesh52@gmail.com',
    subject,
    body: 'This is a test email',
  });

  console.log(`Email sent with ID: ${emailId}`);

  // Check status after 5 seconds
  setTimeout(async () => {
    const status = await emailService.getEmailStatus(emailId);
    console.log(`Email status: ${JSON.stringify(status, null, 2)}`);
  }, 5000);
}

async function main() {
  console.log("Sending first batch of emails:");
  await Promise.all([
    sendTestEmail('Test Email 1'),
    sendTestEmail('Test Email 2'),
    sendTestEmail('Test Email 3'),
  ]);

  // Wait for 6 seconds to allow emails to process
  await new Promise(resolve => setTimeout(resolve, 6000));

  console.log("\nProcessing queue:");
  await emailService.processQueue();

  console.log("\nFinal metrics:");
  const metrics = emailService.getMetrics();
  console.log(`Success rate: ${(metrics.successRate * 100).toFixed(2)}%`);
  console.log(`Average attempts per email: ${metrics.averageAttempts.toFixed(2)}`);
  console.log(`Circuit breaker state: ${emailService.getCircuitBreakerState()}`);
}

main().catch(console.error);