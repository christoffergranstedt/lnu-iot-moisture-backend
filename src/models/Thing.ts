import mongoose from 'mongoose'
import { NoResourceIdError } from '../errors/NoResourceIdError.js'
import { NotUniqueError } from '../errors/NotUniqueError.js'
import { User } from './User.js'

const thingSchema = new mongoose.Schema(
	{
		'@context': { type: String },
		title: { type: String },
		id: { type: String },
		base: { type: String },
		description: { type: String },
		securityDefinitions: {
			bearer_sc: {
				scheme: { type: String }
			}
		},
		security: { type: String },
		properties: [{
			title: { type: String },
			type: { type: String },
			unit: { type: String },
			minimum: { type: Number },
			maximum: { type: Number },
			values: [{ value: { type: String }, date: { type: mongoose.Schema.Types.Date } }],
			forms: [{
				op: { type: Array },
				href: { type: String },
				methodName: { type: String },
				contentType: { type: String }
			}]
		}],
		actions: [{
			title: { type: String },
			forms: [{
				op: { type: Array },
				href: { type: String },
				methodName: { type: String },
				contentType: { type: String }
			}]
		}],
		events: [{
			title: { type: String },
			alertValue: { type: Number },
			subscribers: { type: Array },
			forms: [{
				op: { type: Array },
				href: { type: String },
				methodName: { type: String },
				contentType: { type: String }
			}]
		}],
		forms: [{
			op: { type: Array },
			href: { type: String },
			methodName: { type: String },
			contentType: { type: String }
		}]
	}
)

/**
 * To build a new thing
 *
 * @param {object} thingInput - An object about the thing
 */
thingSchema.statics.build = async (thingInput) => {
	const thingExist = await Thing.exists({ thingId: thingInput.thingId })
	if (thingExist) throw new NotUniqueError('Thing')

	const thing = new Thing(thingInput)
	thing.save()

	return thing
}

/**
 * To fetch all things in database
 *
 * @param {string} userId - Userid that will be used to set if user is subscribing to an event or not
 */
thingSchema.statics.getThings = async (userId) => {
	const things = await Thing.find()

	const returnThings = things.map(thing => {
		const newEvents = thing.events.map((event) => {
			return {
				title: event.title,
				alertValue: event.alertValue,
				isSubscribing: event.subscribers.includes(userId.toString()),
				forms: event.forms
			}
		})

		return {
			...thing.toObject(),
			events: newEvents
		}
	})

	return returnThings
}

/**
 * To fetch a specific thing in database
 *
 * @param {string} userId - Userid that will be used to set if user is subscribing to an event or not
 * @param {string} thingId - Thing id for a specific thing
 */
thingSchema.statics.getThing = async (thingId, userId) => {
	const thing = await Thing.findOne({ id: thingId })

	const eventSubscriptions = thing.events.map(event => {
		if (userId) {
			return {
				title: event.title,
				alertValue: event.alertValue,
				isSubscribing: event.subscribers.includes(userId.toString()),
				forms: event.forms
			}
		} else {
			return {
				title: event.title,
				alertValue: event.alertValue,
				forms: event.forms
			}
		}
	})
	return {
		...thing.toObject(),
		events: eventSubscriptions
	}
}

/**
 * Add a value to a specific property
 *
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} property - The property
 * @param {string} value - The value
 */
thingSchema.statics.addPropertyValue = async (thingId, property, value) => {
	const thing = await Thing.findOne({ id: thingId })
	if (thing.length === 0) throw new NoResourceIdError(thingId)
	const propertyData = thing.properties.find(prop => prop.title === property)
	propertyData.values.push({ value: value, date: new Date() })
	thing.save()
}

/**
 * Get the values for a specific property on a thing
 *
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} property - The property
 */
thingSchema.statics.getPropertyValues = async (thingId, property) => {
	const numberOfValuesReturned = 100 // Quick fix, this should of course be a pagination
	const thing = await Thing.findOne({ id: thingId })
	if (thing.length === 0) throw new NoResourceIdError(thingId)
	const propertyData = thing.properties.find(prop => prop.title === property)

	const values = propertyData.values.slice()
	values.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	const returnValues = values.slice(Math.max(values.length - numberOfValuesReturned, 0))
	return returnValues
}

/**
 * To a subscribe to an event
 *
 * @param {string} userId - Userid that will be used to set if user is subscribing to an event or not
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} eventName - The name of the event
 */
thingSchema.statics.subscribeToEvent = async (userId, thingId, eventName) => {
	const thing = await Thing.findOne({ id: thingId })
	if (thing.length === 0) throw new NoResourceIdError(thingId)
	const eventData = thing.events.find(event => event.title === eventName)
	if (eventData.subscribers.includes(userId)) return

	eventData.subscribers.push(userId)
	thing.save()
}

/**
 * To a unsubscribe to an event
 *
 * @param {string} userId - Userid that will be used to set if user is subscribing to an event or not
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} eventName - The name of the event
 */
thingSchema.statics.unSubscribeToEvent = async (userId, thingId, eventName) => {
	const thing = await Thing.findOne({ id: thingId })
	if (thing.length === 0) throw new NoResourceIdError(thingId)
	const eventData = thing.events.find(event => event.title === eventName)
	const index = eventData.subscribers.indexOf(userId)
	if (index === -1) return

	eventData.subscribers.splice(index, 1)
	thing.save()
}

/**
 * To get all event subscribers
 *
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} eventName - The name of the event
 */
thingSchema.statics.getEventSubscribers = async (thingId, eventName) => {
	const thing = await Thing.findOne({ id: thingId })
	if (thing.length === 0) throw new NoResourceIdError(thingId)
	const eventData = thing.events.find(event => event.title === eventName)

	const subscribers = []
	for (let i = 0; i < eventData.subscribers.length; i++) {
		const user = await User.getUser(eventData.subscribers[i])
		subscribers.push(user)
	}

	return subscribers
}

/**
 * To get the alert value for specifif event
 *
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} eventName - The name of the event
 */
thingSchema.statics.getAlertValue = async (thingId, eventName) => {
	const thing = await Thing.findOne({ id: thingId })
	if (thing.length === 0) throw new NoResourceIdError(thingId)
	const eventData = thing.events.find(event => event.title === eventName)

	return eventData.alertValue
}

const Thing = mongoose.model('Thing', thingSchema)

export { Thing }
