import { MqttClient } from 'mqtt'

export abstract class Subscriber {
	private client: MqttClient
	private topic: string

	constructor (client: MqttClient, topic: string) {
		this.topic = topic
		this.client = client
	}

	public listen () {
		console.log(`Subscribing to ${this.topic}`)
		this.client.subscribe(this.topic)
	}

	abstract onMessage (message: string, thing: string): void
}
