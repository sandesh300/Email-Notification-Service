// tests/EmailService.test.ts

import { EmailService } from '../src/services/EmailService';
import { MockEmailProvider } from '../src/services/MockEmailProvider';

jest.mock('../src/utils/Logger');

describe('EmailService', () => {
  let emailService: EmailService;
  let primaryProvider: MockEmailProvider;
  let secondaryProvider: MockEmailProvider;

  beforeEach(() => {
    primaryProvider = new MockEmailProvider('Primary', 0);
    secondaryProvider = new MockEmailProvider('Secondary', 0);
    emailService = new EmailService(primaryProvider, secondaryProvider, 10, 1000);
  });

  it('should send an email successfully', async () => {
    const emailId = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    });

    expect(emailId).toBeTruthy();

    const status = await emailService.getEmailStatus(emailId);
    expect(status?.status).toBe('sent');
  });

  it('should retry and use secondary provider on failure', async () => {
    primaryProvider.setConsecutiveFailures(3);
    
    const emailId = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    });

    const status = await emailService.getEmailStatus(emailId);
    expect(status?.status).toBe('sent');
    expect(status?.attempts).toBeGreaterThan(1);
  });

  it('should fail after max retries', async () => {
    primaryProvider.setConsecutiveFailures(3);
    secondaryProvider.setConsecutiveFailures(3);

    await expect(emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    })).rejects.toThrow('Failed to send email after 3 attempts');

    const metrics = emailService.getMetrics();
    expect(metrics.successRate).toBe(0);
    expect(metrics.averageAttempts).toBe(3);
  });

  it('should process queued emails', async () => {
    primaryProvider.setConsecutiveFailures(3);
    secondaryProvider.setConsecutiveFailures(3);

    const emailId = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    });

    primaryProvider.setConsecutiveFailures(0);
    secondaryProvider.setConsecutiveFailures(0);

    await emailService.processQueue();

    const status = await emailService.getEmailStatus(emailId);
    expect(status?.status).toBe('sent');
  });
});