import { Request, Response, NextFunction  } from 'express'

/**
 * Home of the REST API. Return just information about the API.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about the REST API
 */
export const startEndpoint = async (_req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({ message: 'Welcome to the REST API for Smart Home' })
	next()
}
