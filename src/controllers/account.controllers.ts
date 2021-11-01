import { Request, Response, NextFunction  } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { User } from '../models/User'
import { UnauthenticatedError } from '../errors/index'
import { notifyUserByTelegram } from '../config/telegram'
import { TokenPayload } from '../types/TokenPayload'

/**
 * Authenticate a user by checking if the provided username and password exist in database and returns an access token and a refresh token
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Access token and refresh token for user.
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body
	const user = await User.authenticate({ username, password })

	const { ACCESS_TOKEN_SECRET } = process.env
	if (!ACCESS_TOKEN_SECRET) throw new Error('ACCESS_TOKEN_SECRET environment variable is not set')

	const payload = {
		userId: user.id,
		username: username
	}

	const optionsAccessToken = {
		expiresIn: '1h'
	}

	const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, optionsAccessToken)

	const refreshToken = crypto.randomBytes(64).toString('hex')

	await User.storeRefreshToken({ userId: user.id, refreshToken })

	res.status(200).json({ 		
		message: 'You are now authenticated',
		user: {
			userId: user.id,
			username: user.username,
			accessToken: accessToken,
			accessTokenExpirationDate: new Date().getTime() + (1000 * 60 * 60),
			refreshToken: refreshToken,
			telegramId: user.telegramId
		}
	})
	next()
}

/**
 * Registers a new account by providing a username and password.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about successful register.
 */
 export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body
	await User.build(username, password)
	res.status(201).json({message: `Welcome to Smart Home ${username}. Please login via link below with your username and password before able to access more endpoints`})
	next()
}

/**
 * Refresh an access token that has expired by providing a refresh token. The refresh token is compared with whats in the database for the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - New access token and refresh token for user.
 */
 export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	const { ACCESS_TOKEN_SECRET } = process.env
	if (!ACCESS_TOKEN_SECRET) throw new Error('ACCESS_TOKEN_SECRET environment variable is not set')

	const authType = req.headers.authorization ? req.headers.authorization.split(' ')[0] : null
	const refreshToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
	if (authType !== 'Bearer' || !refreshToken) return next(new UnauthenticatedError())

	const tokenPayload = <TokenPayload>jwt.verify(refreshToken, ACCESS_TOKEN_SECRET)
	req.user = {
		id: tokenPayload.userId,
		username: tokenPayload.username
	}

	const user = await User.authenticateRefreshToken({ userId: req.user.id, refreshToken })

	const payload = {
		userId: user.id,
		username: user.username
	}

	const optionsAccessToken = {
		expiresIn: '1h'
	}

	const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, optionsAccessToken)

	const newRefreshToken = crypto.randomBytes(64).toString('hex')

	User.storeRefreshToken({ userId: user.id, refreshToken: newRefreshToken })

	res.status(200).json({ 		
		message: 'You have now refreshed your access token and refresh token',
		user: {
			userId: user.id,
			username: user.username,
			accessToken: accessToken,
			accessTokenExpirationDate: new Date().getTime() + (1000 * 60 * 60),
			refreshToken: refreshToken,
			telegramId: user.telegramId
		}
	})
	next()
}

/**
 * Sign outs a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about successful register.
 */
 export const signoutUser = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) return next()
	await User.storeRefreshToken({ userId: req.user.id, refreshToken: '' })
	res.status(200).json({ message: 'Successfully signed out user' })
	next()
}

/**
 * Set up telegram account and connect it to user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} - Information about successful register.
 */
 export const telegramSetup = async (req: Request, res: Response, next: NextFunction) => {
	const telegramId = req.body.message.chat.id
	const userId = req.body.message.text
	const user = await User.addTelegramId(userId, telegramId)
	if (user && user.telegramId) {
		await notifyUserByTelegram(user.telegramId, 'You have succesfully authenticated your telegram id with your user account')
		res.status(200).json({ message: 'You have succesfully authenticated your telegram id with your user account' })
	} else {
		await notifyUserByTelegram(telegramId, 'Your user id could not be found, please try again. Type your userid without quotation marks')
		res.status(400)
	}
	next()
}