import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError.js'
import { Thing } from '../models/Thing.js'

/**
 * To get all events for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getEvents = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To get a specific event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getEvent = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To create a new event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const createEvent = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To subscribe to an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const subscribeEvent = async (req, res, next) => {
	const { eventName, thingId } = req.params
	await Thing.subscribeToEvent(req.user.id, thingId, eventName)
	res.locals.data = {
		message: 'You have now subscribed to the event'
	}
	res.status(200)
	return next()
}

/**
 * To unsubscribe to an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const unSubscribeEvent = async (req, res, next) => {
	const { eventName, thingId } = req.params
	await Thing.unSubscribeToEvent(req.user.id, thingId, eventName)
	res.locals.data = {
		message: 'You have now unsubscribed to the event'
	}
	res.status(200)
	return next()
}

/**
 * To update an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const updateEvent = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To delete an event for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const deleteEvent = async (req, res, next) => {
	EndpointNotImplementedYetError()
}
