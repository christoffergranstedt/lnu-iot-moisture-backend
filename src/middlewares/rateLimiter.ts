import { Request, Response, NextFunction } from "express"
import rateLimit from 'express-rate-limit'

import { RateLimitError } from '../errors/RateLimitError'

/**
 * Set the rate limit for a specific IP-adress
 *
 */
export const apiRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	handler: (_req: Request, _res: Response, _next: NextFunction) => {
		throw new RateLimitError()
	}
})
