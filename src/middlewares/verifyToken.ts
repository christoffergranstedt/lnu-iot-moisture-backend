import { Request, Response, NextFunction  } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthenticatedError } from '../errors/index'
import { TokenPayload } from '../types/TokenPayload'

/**
 * Verifies if user provided a correct access token in authorization header
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Returns next
 */
export const verifyAccessToken = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const { ACCESS_TOKEN_SECRET } = process.env
		if (!ACCESS_TOKEN_SECRET) throw new Error('Access token secret is not provided as a environment variable')

		const authType = req.headers.authorization ? req.headers.authorization.split(' ')[0] : null
		const authToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

		if (authType !== 'Bearer' || !authToken) return next(new UnauthenticatedError())

		const tokenPayload = <TokenPayload>jwt.verify(authToken, ACCESS_TOKEN_SECRET)

		req.user = {
			id: tokenPayload.userId,
			username: tokenPayload.username
		}
		return next()
	} catch (error) {
		throw new UnauthenticatedError()
	}
}
