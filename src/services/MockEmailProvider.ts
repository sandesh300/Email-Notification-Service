
import { EmailProvider } from '../interfaces/EmailProvider';

export class MockEmailProvider implements EmailProvider {
  private name: string;
  private failureRate: number;
  private consecutiveFailures: number;

  constructor(name: string, failureRate: number = 0.2, consecutiveFailures: number = 0) {
    this.name = name;
    this.failureRate = failureRate;
    this.consecutiveFailures = consecutiveFailures;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    if (this.consecutiveFailures > 0) {
      this.consecutiveFailures--;
      throw new Error(`${this.name} failed to send email`);
    }

    if (Math.random() < this.failureRate) {
      throw new Error(`${this.name} failed to send email`);
    }
    
    console.log(`${this.name} sent email to ${to}`);
    return true;
  }
}