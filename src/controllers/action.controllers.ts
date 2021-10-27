import { ACTIONS } from '../actions/actions.js'
import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError.js'
import { getCurrentMoisturePublisher } from '../config/mqtt/mqtt.js'
import { PUBLISHER_TOPIC } from '../config/mqtt/PublisherTopic.js'

/**
 * To get info about all actions for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getActions = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To get info about a specific action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const getAction = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To create a new action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const createAction = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To invoke an specific action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const invokeAction = async (req, res, next) => {
	const { actionName, thingId } = req.params

	if (actionName === ACTIONS.GET_CURRENT_MOISTURE_VALUE) {
		getCurrentMoisturePublisher.publish(PUBLISHER_TOPIC.GET_CURRENT_MOISTURE_VALUE(thingId), '')
	}

	res.locals.data = {
		message: 'The action has been invoked'
	}
	res.status(200)
	return next()
}

/**
 * To update an action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const updateAction = async (req, res, next) => {
	EndpointNotImplementedYetError()
}

/**
 * To delete an action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const deleteAction = async (req, res, next) => {
	EndpointNotImplementedYetError()
}