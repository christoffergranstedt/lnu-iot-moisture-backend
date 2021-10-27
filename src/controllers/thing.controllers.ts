import { Thing } from '../models/Thing.js'
import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError.js'

/**
 * To get all things
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getThings = async (req, res, next) => {
	const things = await Thing.getThings(req.user.id)
	res.locals.data = {
		message: 'All things fetched',
		things: things
	}
	res.status(200)
	return next()
}

/**
 * To get a specific thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getThing = async (req, res, next) => {
	const { thingId } = req.params
	const thing = await Thing.getThing(thingId, req.user.id)
	res.locals.data = {
		message: 'Thing is fetched',
		thing: thing
	}
	res.status(200)
	return next()
}

/**
 * To create a new thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const createThing = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To update a specific thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const updateThing = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To delete a specific thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const deleteThing = async (req, res, next) => {
	EndpointNotImplementedYetError()
}
