import { Request, Response, NextFunction  } from 'express'

import { Actions } from '../constants/Actions'
import { Publisher } from '../config/mqtt/Publisher'
import { GetCurrentMoisturePublisher } from '../actions/publishers/GetCurrentMoisturePublisher'
import { AppGlobal } from '../constants/AppGlobal'
import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError'

/**
 * To get info about all actions for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getActions = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To get info about a specific action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
 export const getAction = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To create a new action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
 export const createAction = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To invoke an specific action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
 export const invokeAction = async (req: Request, res: Response, next: NextFunction) => {
	const { actionName, thingId } = req.params

	const getCurrentMoisturePublisher = new GetCurrentMoisturePublisher(req.app.get(AppGlobal.MqttClient))

	if (actionName === Actions.GetCurrentMoistureValue) {
		getCurrentMoisturePublisher.publish(Publisher.getCurrentMoistureValue(thingId), '')
	}

	res.status(200).json({ message: 'The action has been invoked' })
	next()
}

/**
 * To update an action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
 export const updateAction = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}

/**
 * To delete an action for a thing
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
 export const deleteAction = async (_req: Request, _res: Response, _next: NextFunction) => {
	throw new EndpointNotImplementedYetError()
}