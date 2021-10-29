import { MqttClient } from 'mqtt'

export class Publisher {
	private client: MqttClient

	constructor (client: MqttClient) {
		this.client = client
	}

	publish (topic: string, data: string): void {
		this.client.publish(topic, data)
	}

	public static getCurrentMoistureValue (thingId: string): string {
		return `things/${thingId}/moisture/get/current`
	}
}
