import { Request, Response, NextFunction  } from 'express'

import { UnauthenticatedError } from '../errors/index'

/**
 * Verifies that only a admin that holds the admin token can access
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns next
 */
export const verifyAdminToken = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const { ADMIN_TOKEN } = process.env
		const authType = req.headers.authorization ? req.headers.authorization.split(' ')[0] : null
		const adminToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

		if (authType !== 'Bearer') throw new UnauthenticatedError()
		if (adminToken !== ADMIN_TOKEN) throw new UnauthenticatedError()

		return next()
	} catch (error) {
		throw new UnauthenticatedError()
	}
}
