export class RateLimiter {
    private limit: number;
    private interval: number;
    private tokens: number;
    private lastRefill: number;
  
    constructor(limit: number, interval: number) {
      this.limit = limit;
      this.interval = interval;
      this.tokens = limit;
      this.lastRefill = Date.now();
    }
  
    async waitForToken(): Promise<void> {
      this.refillTokens();
      if (this.tokens > 0) {
        this.tokens--;
        return;
      }
      const delay = this.interval - (Date.now() - this.lastRefill);
      await new Promise(resolve => setTimeout(resolve, delay));
      await this.waitForToken();
    }
  
    private refillTokens(): void {
      const now = Date.now();
      const timePassed = now - this.lastRefill;
      const refillAmount = Math.floor(timePassed / this.interval) * this.limit;
      this.tokens = Math.min(this.limit, this.tokens + refillAmount);
      this.lastRefill = now;
    }
  }