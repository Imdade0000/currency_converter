import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private readonly requests = new Map<string, RateLimitRecord>();
    private readonly windowMs = parseInt(process.env.RATE_LIMIT_TTL || '60', 10) * 1000;
    private readonly maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

    use(req: Request, res: Response, next: NextFunction) {
        const key = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
        const now = Date.now();

        const record = this.requests.get(key);

        if (!record || now > record.resetTime) {
            this.requests.set(key, { count: 1, resetTime: now + this.windowMs });
            res.setHeader('X-RateLimit-Limit', this.maxRequests);
            res.setHeader('X-RateLimit-Remaining', this.maxRequests - 1);
            return next();
        }

        if (record.count >= this.maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: 'Trop de requêtes. Veuillez réessayer plus tard.',
                    retryAfter,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        record.count++;
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', this.maxRequests - record.count);
        next();
    }
}
