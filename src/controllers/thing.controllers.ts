import { Request, Response, NextFunction  } from 'express'

import { Thing } from '../models/Thing'
import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError'

/**
 * To get all things
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getThings = async (req: Request, res: Response, next: NextFunction) => {
	const things = await Thing.getThings(req.user.id)

	res.status(200).json({ message: 'All things fetched', things: things})
	next()
}

/**
 * To get a specific thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getThing = async (req: Request, res: Response, next: NextFunction) => {
	const { thingId } = req.params
	const thing = await Thing.getThing(thingId, req.user.id)

	res.status(200).json({ message: 'Thing is fetched',	thing: thing})
	next()
}

/**
 * To create a new thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createThing = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To update a specific thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateThing = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To delete a specific thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteThing = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}
