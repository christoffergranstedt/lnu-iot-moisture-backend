import { Request, Response, NextFunction  } from 'express'

import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError'
import { Thing } from '../models/Thing'

/**
 * To get all events for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvents = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To get a specific event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvent = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To create a new event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createEvent = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To subscribe to an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const subscribeEvent = async (req: Request, res: Response, next: NextFunction) => {
	const { eventName, thingId } = req.params
	await Thing.subscribeToEvent(req.user.id, thingId, eventName)
	res.status(200).json({ message: 'You have now subscribed to the event' })
	next()
}

/**
 * To unsubscribe to an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
 export const unSubscribeEvent = async (req: Request, res: Response, next: NextFunction) => {
	const { eventName, thingId } = req.params
	await Thing.unSubscribeToEvent(req.user.id, thingId, eventName)

	res.status(200).json({ message: 'You have now unsubscribed to the event' })
	next()
}

/**
 * To update an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateEvent = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To delete an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteEvent = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}
