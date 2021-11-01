import { MqttClient } from 'mqtt'

import { Subscriber } from '../../config/mqtt/Subscriber'
import { Thing } from '../../models/Thing'
import { notifyUserByTelegram } from '../../config/telegram'
import { Events } from '../../constants/Events'
import { SubscriberTopic } from '../../constants/SubscriberTopic'

export class CurrentMoistureValueSubscriber extends Subscriber {
	constructor (client: MqttClient) {
		const topic = SubscriberTopic.CurrentMoistureValue
		super(client, topic)
	}

	async onMessage (message: string, thingId: string): Promise<void> {
		const valueInProcent = 100 * parseFloat(message)
		const users = await Thing.getEventSubscribers(thingId, Events.CurrentMoistureValue)
		const event = `Current moisture level in thing, ${thingId}, is: ${valueInProcent.toFixed(2)}%`
		for (let i = 0; i < users.length; i++) {
			const telegramId = (users[i].telegramId) as string
			if (users[i].telegramId) await notifyUserByTelegram(telegramId, event)
		}
	}
}
