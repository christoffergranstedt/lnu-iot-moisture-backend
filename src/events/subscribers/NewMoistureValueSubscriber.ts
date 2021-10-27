import { SUBSCRIBER_TOPIC } from '../../config/mqtt/SubscriberTopic.js'
import { Subscriber } from '../../config/mqtt/Subscriber.js'
import { Thing } from '../../models/Thing.js'
import { PROPERTIES } from '../../config/mqtt/Properties.js'
import { NoResourceIdError } from '../../errors/NoResourceIdError.js'
import { EVENTS } from '../events.js'
import { notifyUserByTelegram } from '../../config/telegram.js'

export class NewMoistureValueSubscriber extends Subscriber {
	constructor (client) {
		const topic = SUBSCRIBER_TOPIC.NEW_MOISTURE_VALUE
		super(client, topic)
		this.property = PROPERTIES.MOISTURE
	}

	async onMessage (message, thingId) {
		const thing = await Thing.getThing(thingId)
		if (thing.length === 0) throw new NoResourceIdError(thingId)
		const valueInProcent = parseFloat(message) * 100
		await Thing.addPropertyValue(thingId, this.property, valueInProcent)

		const lowAlertValue = await Thing.getAlertValue(thingId, EVENTS.LOW_MOISTURE)
		const highAlertValue = await Thing.getAlertValue(thingId, EVENTS.HIGH_MOISTURE)

		if (valueInProcent < lowAlertValue) {
			const users = await Thing.getEventSubscribers(thingId, EVENTS.LOW_MOISTURE)
			const event = `Low moisture level in thing, ${thingId}. Moisture value is : ${valueInProcent.toFixed(2)}%`
			for (let i = 0; i < users.length; i++) {
				await notifyUserByTelegram(users[i], event)
			}
		}

		if (valueInProcent > highAlertValue) {
			const users = await Thing.getEventSubscribers(thingId, EVENTS.HIGH_MOISTURE)
			const event = `High moisture level in thing, ${thingId}. Moisture value is : ${valueInProcent.toFixed(2)}%`
			for (let i = 0; i < users.length; i++) {
				await notifyUserByTelegram(users[i], event)
			}
		}
	}
}
