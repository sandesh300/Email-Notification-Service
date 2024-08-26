
export class CircuitBreaker {
    private failureThreshold: number;
    private resetTimeout: number;
    private failureCount: number;
    private lastFailure: number | null;
    private state: 'closed' | 'open' | 'half-open';
    private resetTimer: NodeJS.Timeout | null;
  
    constructor(failureThreshold: number, resetTimeout: number) {
      this.failureThreshold = failureThreshold;
      this.resetTimeout = resetTimeout;
      this.failureCount = 0;
      this.lastFailure = null;
      this.state = 'closed';
      this.resetTimer = null;
    }
  
    async execute<T>(fn: () => Promise<T>): Promise<T> {
      if (this.state === 'open') {
        if (this.lastFailure && Date.now() - this.lastFailure > this.resetTimeout) {
          this.state = 'half-open';
        } else {
          throw new Error('Circuit is open');
        }
      }
  
      try {
        const result = await fn();
        this.onSuccess();
        return result;
      } catch (error) {
        this.onFailure();
        throw error;
      }
    }
  
    private onSuccess(): void {
      this.failureCount = 0;
      this.state = 'closed';
      this.cancelResetTimer();
    }
  
    private onFailure(): void {
      this.failureCount++;
      this.lastFailure = Date.now();
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'open';
        this.scheduleReset();
      }
    }
  
    private scheduleReset(): void {
      if (!this.resetTimer) {
        this.resetTimer = setTimeout(() => this.reset(), this.resetTimeout);
      }
    }
  
    private cancelResetTimer(): void {
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
        this.resetTimer = null;
      }
    }
  
    reset(): void {
      this.failureCount = 0;
      this.state = 'closed';
      this.lastFailure = null;
      this.cancelResetTimer();
    }
  
    getState(): string {
      return this.state;
    }
  }