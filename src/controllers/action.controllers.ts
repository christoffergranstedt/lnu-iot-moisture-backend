import { Request, Response, NextFunction  } from 'express'

import { Actions } from '../constants/Actions'
import { Publisher } from '../config/mqtt/Publisher'
import { GetCurrentMoisturePublisher } from '../actions/publishers/GetCurrentMoisturePublisher'
import { AppGlobal } from '../constants/AppGlobal'
import { EndpointNotImplementedYetError } from '../errors/EndpointNotImplementedYetError'
import { Thing } from '../models/Thing'
import { Events } from '../constants/Events'
import { notifyUserByTelegram } from '../config/telegram'

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
 export const invokeAction = async (req: Request, res: Response) => {
	const { actionName, thingId } = req.params

	if (actionName === Actions.GetCurrentMoistureValue) {
		const getCurrentMoisturePublisher = new GetCurrentMoisturePublisher(req.app.get(AppGlobal.MqttClient))
		getCurrentMoisturePublisher.publish(Publisher.getCurrentMoistureValue(thingId), '')

		const valueInProcent = Math.floor(Math.random() * (90 - 20 + 1)) + 20; // Random number between 20 and 90
		const users = await Thing.getEventSubscribers(thingId, Events.CurrentMoistureValue)
		const event = `Current moisture level in thing, ${thingId}, is: ${valueInProcent.toFixed(2)}%`
		for (let i = 0; i < users.length; i++) {
			const telegramId = (users[i].telegramId) as string
			if (users[i].telegramId) await notifyUserByTelegram(telegramId, event)
		}
	}

	return res.status(200).json({ message: 'The action has been invoked' })
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