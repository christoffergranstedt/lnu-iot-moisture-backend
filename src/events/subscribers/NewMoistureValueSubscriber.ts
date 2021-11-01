import { MqttClient } from 'mqtt'

import { Subscriber } from '../../config/mqtt/Subscriber'
import { Thing } from '../../models/Thing'
import { NoResourceIdError } from '../../errors/NoResourceIdError'
import { notifyUserByTelegram } from '../../config/telegram'
import { SubscriberTopic } from '../../constants/SubscriberTopic'
import { PROPERTY } from '../../constants/Property'
import { Events } from '../../constants/Events'

export class NewMoistureValueSubscriber extends Subscriber {
	private property: string

	constructor (client: MqttClient) {
		const topic = SubscriberTopic.NewMoistureValue
		super(client, topic)
		this.property = PROPERTY.Moisture
	}

	async onMessage (message: string, thingId: string): Promise<void> {
		const thing = await Thing.getThing(thingId)
		if (!thing) throw new NoResourceIdError(thingId)

		const valueInProcent = parseFloat(message) * 100
		await Thing.addPropertyValue(thingId, this.property, valueInProcent)

		const lowAlertValue = await Thing.getAlertValue(thingId, Events.LowMoisture)
		const highAlertValue = await Thing.getAlertValue(thingId, Events.HighMoisture)

		if (valueInProcent < lowAlertValue) {
			const users = await Thing.getEventSubscribers(thingId, Events.LowMoisture)
			const event = `Low moisture level in thing, ${thingId}. Moisture value is : ${valueInProcent.toFixed(2)}%`
			for (let i = 0; i < users.length; i++) {
				const telegramId = (users[i].telegramId) as string
				if (users[i].telegramId) await notifyUserByTelegram(telegramId, event)
			}
		}

		if (valueInProcent > highAlertValue) {
			const users = await Thing.getEventSubscribers(thingId, Events.HighMoisture)
			const event = `High moisture level in thing, ${thingId}. Moisture value is : ${valueInProcent.toFixed(2)}%`
			for (let i = 0; i < users.length; i++) {
				const telegramId = (users[i].telegramId) as string
				if (users[i].telegramId) await notifyUserByTelegram(telegramId, event)
			}
		}
	}
}
