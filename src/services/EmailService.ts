
import { v4 as uuidv4 } from 'uuid';
import { EmailProvider } from '../interfaces/EmailProvider';
import { Email, EmailStatus } from '../types';
import { RateLimiter } from './RateLimiter';
import { CircuitBreaker } from '../utils/CircuitBreaker';
import { Logger } from '../utils/Logger';
import { EmailQueue } from './EmailQueue';

export class EmailService {
  private primaryProvider: EmailProvider;
  private secondaryProvider: EmailProvider;
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;
  private emailStatuses: Map<string, EmailStatus>;
  private emailQueue: EmailQueue;
  private totalAttempts: number = 0;
  private successfulAttempts: number = 0;

  constructor(
    primaryProvider: EmailProvider,
    secondaryProvider: EmailProvider,
    rateLimit: number,
    rateLimitInterval: number
  ) {
    this.primaryProvider = primaryProvider;
    this.secondaryProvider = secondaryProvider;
    this.rateLimiter = new RateLimiter(rateLimit, rateLimitInterval);
    this.circuitBreaker = new CircuitBreaker(5, 60000);
    this.emailStatuses = new Map();
    this.emailQueue = new EmailQueue();
  }

  async sendEmail(email: Email): Promise<string> {
    const id = uuidv4();
    const status: EmailStatus = {
      id,
      email,
      status: 'pending',
      attempts: 0,
      lastAttempt: null,
    };
    this.emailStatuses.set(id, status);

    this.sendEmailWithRetry(id).catch((error) => {
      Logger.error(`Failed to send email ${id}: ${error.message}`);
      this.emailQueue.enqueue(id, email);
    });

    return id;
  }

  async getEmailStatus(id: string): Promise<EmailStatus | undefined> {
    return this.emailStatuses.get(id);
  }

  private async sendEmailWithRetry(id: string): Promise<void> {
    const status = this.emailStatuses.get(id);
    if (!status) return;

    const maxRetries = 3;
    let currentProvider = this.primaryProvider;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      status.attempts++;
      status.lastAttempt = new Date();
      this.totalAttempts++;

      try {
        await this.rateLimiter.waitForToken();
        await this.circuitBreaker.execute(async () => {
          const result = await currentProvider.sendEmail(
            status.email.to,
            status.email.subject,
            status.email.body
          );
          if (result) {
            status.status = 'sent';
            this.successfulAttempts++;
            Logger.log(`Email ${id} sent successfully`);
            return;
          }
        });

        if (status.status === 'sent') return;
      } catch (error) {
        if (error instanceof Error) {
          Logger.error(`Attempt ${attempt + 1} failed for email ${id}: ${error.message}`);
        } else {
          Logger.error(`Attempt ${attempt + 1} failed for email ${id}: Unknown error`);
        }
        await this.exponentialBackoff(attempt);
      }

      if (attempt === maxRetries - 2) {
        currentProvider = this.secondaryProvider;
        Logger.log(`Switching to secondary provider for email ${id}`);
      }
    }

    status.status = 'failed';
    Logger.error(`Email ${id} failed after ${maxRetries} attempts`);
  }

  private async exponentialBackoff(attempt: number): Promise<void> {
    const delay = Math.pow(2, attempt) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async processQueue(): Promise<void> {
    while (!this.emailQueue.isEmpty()) {
      const item = this.emailQueue.dequeue();
      if (item) {
        await this.sendEmailWithRetry(item.id);
      }
    }
  }

  getMetrics(): { successRate: number; averageAttempts: number } {
    const successRate = this.totalAttempts > 0 ? this.successfulAttempts / this.totalAttempts : 0;
    const averageAttempts = this.emailStatuses.size > 0 ? this.totalAttempts / this.emailStatuses.size : 0;
    return { successRate, averageAttempts };
  }

  getCircuitBreakerState(): string {
    return this.circuitBreaker.getState();
  }
}