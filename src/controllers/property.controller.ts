import { Request, Response, NextFunction  } from 'express'

import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError'
import { Thing } from '../models/Thing'

/**
 * To get all properties for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProperties = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To get a speicific event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProperty = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To get all values for a spcecific property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getPropertyValues = async (req: Request, res: Response, next: NextFunction) => {
	const { propertyName, thingId } = req.params
	const values = await Thing.getPropertyValues(thingId, propertyName)
	res.locals.data = {
		message: 'Values for the property, there may be more values, see pagination',
		values: values
	}
	res.status(200)
	return next()
}

/**
 * To create a new property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createProperty = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To update a property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateProperty = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To delete a property for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteProperty = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}
