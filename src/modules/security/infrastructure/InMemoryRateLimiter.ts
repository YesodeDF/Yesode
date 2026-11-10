import { RateLimitExceededError } from '../domain/exceptions/SecurityErrors.ts';

interface RateLimitRecord {
  timestamps: number[];
}

export class InMemoryRateLimiter {
  private static instance: InMemoryRateLimiter;
  private readonly hits = new Map<string, RateLimitRecord>();

  private constructor() {
    // Auto cleanup expired records every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.hits.entries()) {
        const valid = record.timestamps.filter((t) => now - t < 3600000); // 1h window max
        if (valid.length === 0) {
          this.hits.delete(key);
        } else {
          record.timestamps = valid;
        }
      }
    }, 300000);
  }

  public static getInstance(): InMemoryRateLimiter {
    if (!InMemoryRateLimiter.instance) {
      InMemoryRateLimiter.instance = new InMemoryRateLimiter();
    }
    return InMemoryRateLimiter.instance;
  }

  public check(ip: string, action: string, maxRequests: number, windowSeconds: number): void {
    const key = `${action}:${ip || 'unknown'}`;
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    let record = this.hits.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.hits.set(key, record);
    }

    // Filter out timestamps outside window
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    if (record.timestamps.length >= maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
      throw new RateLimitExceededError(retryAfterSeconds);
    }

    record.timestamps.push(now);
  }
}

