import mqtt, { MqttClient } from 'mqtt'
import { NewMoistureValueSubscriber } from '../../events/subscribers/NewMoistureValueSubscriber'
import { CurrentMoistureValueSubscriber } from '../../events/subscribers/CurrentMoistureValueSubscriber'
import { SubscriberTopic } from '../../constants/SubscriberTopic'

class MQTTClient {
	private mqttClient: MqttClient
	private newMoistureValueSubscriber: NewMoistureValueSubscriber
	private currentMoistureValueSubscriber: CurrentMoistureValueSubscriber

	public getClient (): MqttClient {
		return this.mqttClient
	}

	public connect (): void {
		const { MQTT_USER, MQTT_PASSWORD, MQTT_PORT, MQTT_HOST, MQTT_CLIENT_ID } = process.env
		if (!MQTT_USER || !MQTT_PASSWORD || !MQTT_PORT || !MQTT_HOST || !MQTT_CLIENT_ID) throw new Error('MQTT connection environment variables is incorrect and missing')

		this.mqttClient = mqtt.connect(`mqtt://${MQTT_HOST}`, {
			port: parseInt(MQTT_PORT),
			host: MQTT_HOST,
			clientId: MQTT_CLIENT_ID,
			username: MQTT_USER,
			password: MQTT_PASSWORD,
			reconnectPeriod: 1000
		})

		this.mqttClient.on('connect', () => {
			console.log('Connected to MQTT Broker')
			this.initializeListeners()
		})

		this.mqttClient.on('message', (originalTopic, message) => {
			const splittedTopic = originalTopic.split('/')
			const thingId = splittedTopic[1]
			splittedTopic[1] = '+'
			const topicWithoutDeviceId = splittedTopic.join('/')
			const parsedMessage = message.toString()
			if (topicWithoutDeviceId === SubscriberTopic.NewMoistureValue || originalTopic === SubscriberTopic.NewMoistureValue) this.newMoistureValueSubscriber.onMessage(parsedMessage, thingId)
			if (topicWithoutDeviceId === SubscriberTopic.CurrentMoistureValue || originalTopic === SubscriberTopic.CurrentMoistureValue) this.currentMoistureValueSubscriber.onMessage(parsedMessage, thingId)
		})
	}

	private initializeListeners (): void {
		this.newMoistureValueSubscriber = new NewMoistureValueSubscriber(this.mqttClient)
		this.currentMoistureValueSubscriber = new CurrentMoistureValueSubscriber(this.mqttClient)

		this.newMoistureValueSubscriber.listen()
		this.currentMoistureValueSubscriber.listen()
	}

	public close (): void {
		this.mqttClient.end()
	}
}

export const mqttClient = new MQTTClient()
