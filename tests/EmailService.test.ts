import { EmailService } from '../src/services/EmailService';
import { MockEmailProvider } from '../src/services/MockEmailProvider';

describe('EmailService', () => {
  let emailService: EmailService;
  let primaryProvider: MockEmailProvider;
  let secondaryProvider: MockEmailProvider;

  beforeEach(() => {
    primaryProvider = new MockEmailProvider('Primary', 0.5);
    secondaryProvider = new MockEmailProvider('Secondary', 0.2);
    emailService = new EmailService(primaryProvider, secondaryProvider, 10, 1000);
  });

  it('should send an email successfully', async () => {
    const emailId = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    });

    expect(emailId).toBeTruthy();

    // Wait for the email to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    const status = await emailService.getEmailStatus(emailId);
    expect(status?.status).toBe('sent');
  });

  it('should retry and use secondary provider on failure', async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds

    const failingPrimaryProvider = new MockEmailProvider('Failing Primary', 1);
    const emailService = new EmailService(failingPrimaryProvider, secondaryProvider, 10, 1000);

    const emailId = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
    });

    // Wait for the email to be processed
    await new Promise(resolve => setTimeout(resolve, 5000));

    const status = await emailService.getEmailStatus(emailId);
    expect(status?.status).toBe('sent');
    expect(status?.attempts).toBeGreaterThan(1);
  });
});
