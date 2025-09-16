/**
 * Rate Limiting and DDoS Protection
 * 
 * Implements comprehensive rate limiting, DDoS protection, and security measures
 * 
 * @fileoverview Rate limiting and DDoS protection implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
  onLimitReached?: (req: NextRequest) => void;
}

export interface DDoSProtectionConfig {
  enabled: boolean;
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  blockDuration: number; // Duration to block IP in milliseconds
  whitelist: string[]; // Whitelisted IPs
  blacklist: string[]; // Blacklisted IPs
}

export interface SecurityHeaders {
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Content-Security-Policy': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
}

export class RateLimiter {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(redis: Redis, config: RateLimitConfig) {
    this.redis = redis;
    this.config = config;
  }

  /**
   * Check if request is within rate limit
   */
  async checkRateLimit(req: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = this.generateKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get current requests in window
    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart); // Remove old requests
    pipeline.zcard(key); // Count current requests
    pipeline.zadd(key, now, `${now}-${Math.random()}`); // Add current request
    pipeline.expire(key, Math.ceil(this.config.windowMs / 1000)); // Set expiry

    const results = await pipeline.exec();
    const currentRequests = results?.[1]?.[1] as number || 0;

    const allowed = currentRequests < this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - currentRequests);
    const resetTime = now + this.config.windowMs;

    if (!allowed && this.config.onLimitReached) {
      this.config.onLimitReached(req);
    }

    return { allowed, remaining, resetTime };
  }

  /**
   * Generate rate limit key
   */
  private generateKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }

    // Default key generation based on IP and user agent
    const ip = this.getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    return `rate_limit:${ip}:${Buffer.from(userAgent).toString('base64')}`;
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const clientIP = req.headers.get('x-client-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || clientIP || 'unknown';
  }
}

export class DDoSProtection {
  private redis: Redis;
  private config: DDoSProtectionConfig;

  constructor(redis: Redis, config: DDoSProtectionConfig) {
    this.redis = redis;
    this.config = config;
  }

  /**
   * Check if request is from blocked IP
   */
  async isBlocked(req: NextRequest): Promise<boolean> {
    if (!this.config.enabled) return false;

    const ip = this.getClientIP(req);
    
    // Check whitelist
    if (this.config.whitelist.includes(ip)) {
      return false;
    }

    // Check blacklist
    if (this.config.blacklist.includes(ip)) {
      return true;
    }

    // Check if IP is temporarily blocked
    const blockKey = `ddos_block:${ip}`;
    const isBlocked = await this.redis.exists(blockKey);
    
    if (isBlocked) {
      return true;
    }

    // Check request rates
    const isRateLimited = await this.checkRequestRates(ip);
    
    if (isRateLimited) {
      // Block IP temporarily
      await this.redis.setex(blockKey, Math.ceil(this.config.blockDuration / 1000), '1');
      return true;
    }

    return false;
  }

  /**
   * Check request rates against thresholds
   */
  private async checkRequestRates(ip: string): Promise<boolean> {
    const now = Date.now();
    const minuteAgo = now - 60000;
    const hourAgo = now - 3600000;
    const dayAgo = now - 86400000;

    const pipeline = this.redis.pipeline();
    
    // Count requests in last minute
    pipeline.zcount(`ddos_minute:${ip}`, minuteAgo, now);
    pipeline.zremrangebyscore(`ddos_minute:${ip}`, 0, minuteAgo);
    pipeline.zadd(`ddos_minute:${ip}`, now, now);
    pipeline.expire(`ddos_minute:${ip}`, 60);

    // Count requests in last hour
    pipeline.zcount(`ddos_hour:${ip}`, hourAgo, now);
    pipeline.zremrangebyscore(`ddos_hour:${ip}`, 0, hourAgo);
    pipeline.zadd(`ddos_hour:${ip}`, now, now);
    pipeline.expire(`ddos_hour:${ip}`, 3600);

    // Count requests in last day
    pipeline.zcount(`ddos_day:${ip}`, dayAgo, now);
    pipeline.zremrangebyscore(`ddos_day:${ip}`, 0, dayAgo);
    pipeline.zadd(`ddos_day:${ip}`, now, now);
    pipeline.expire(`ddos_day:${ip}`, 86400);

    const results = await pipeline.exec();
    
    const minuteRequests = results?.[0]?.[1] as number || 0;
    const hourRequests = results?.[4]?.[1] as number || 0;
    const dayRequests = results?.[8]?.[1] as number || 0;

    return (
      minuteRequests > this.config.maxRequestsPerMinute ||
      hourRequests > this.config.maxRequestsPerHour ||
      dayRequests > this.config.maxRequestsPerDay
    );
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const clientIP = req.headers.get('x-client-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || clientIP || 'unknown';
  }
}

export class SecurityHeaders {
  private static readonly DEFAULT_HEADERS: SecurityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  };

  /**
   * Apply security headers to response
   */
  static applyHeaders(response: NextResponse): NextResponse {
    Object.entries(this.DEFAULT_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  /**
   * Get security headers
   */
  static getHeaders(): SecurityHeaders {
    return { ...this.DEFAULT_HEADERS };
  }
}

export class SecurityMiddleware {
  private rateLimiter: RateLimiter;
  private ddosProtection: DDoSProtection;

  constructor(redis: Redis) {
    this.rateLimiter = new RateLimiter(redis, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per 15 minutes
      keyGenerator: (req) => {
        const ip = this.getClientIP(req);
        const userId = req.headers.get('x-user-id') || 'anonymous';
        return `rate_limit:${ip}:${userId}`;
      },
      onLimitReached: (req) => {
        console.warn(`Rate limit exceeded for IP: ${this.getClientIP(req)}`);
      },
    });

    this.ddosProtection = new DDoSProtection(redis, {
      enabled: true,
      maxRequestsPerMinute: 60,
      maxRequestsPerHour: 1000,
      maxRequestsPerDay: 10000,
      blockDuration: 15 * 60 * 1000, // 15 minutes
      whitelist: [],
      blacklist: [],
    });
  }

  /**
   * Middleware function
   */
  async middleware(req: NextRequest): Promise<NextResponse | null> {
    // Check DDoS protection
    const isBlocked = await this.ddosProtection.isBlocked(req);
    if (isBlocked) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    // Check rate limiting
    const rateLimitResult = await this.rateLimiter.checkRateLimit(req);
    if (!rateLimitResult.allowed) {
      const response = new NextResponse('Too Many Requests', { status: 429 });
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      return response;
    }

    // Apply security headers
    const response = NextResponse.next();
    SecurityHeaders.applyHeaders(response);
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

    return response;
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const clientIP = req.headers.get('x-client-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || clientIP || 'unknown';
  }
}

// Export singleton instance
export const securityMiddleware = new SecurityMiddleware(
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
);
