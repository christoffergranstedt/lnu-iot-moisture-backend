import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction  } from 'express'

import { InputValidationError } from '../errors/index'
import { ErrorResponse } from '../types/ErrorResponse'

// USER VALIDATORS
export const validateUser = [
	body('username')
		.isLength({ min: 1, max: 50 }).withMessage('Username is required and need to be between 1 and 50 characters.')
		.trim()
		.escape(),
	body('password')
		.isLength({ min: 6, max: 2000 }).withMessage('Password is required and need to be between 6 and 2000 characters.')
		.trim()
		.escape()
]

export const validateThing = [
	// TODO
]

export const validateProperty = [
	// TODO
]

export const validateAction = [
	// TODO
]

export const validateEvent = [
	// TODO
]

/**
 * Middleware, validate if there are any errors of input.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {object} User and message.
 */
export const validate = (req: Request, _res: Response, next: NextFunction) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		return next()
	}

	const extractedErrors: ErrorResponse[] = []
	errors.array().map(error => extractedErrors.push({ message: error.msg }))
	throw new InputValidationError(extractedErrors)
}
