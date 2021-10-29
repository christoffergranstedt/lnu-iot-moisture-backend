import mongoose from 'mongoose'
import { NoResourceIdError } from '../errors/NoResourceIdError'
import { NotUniqueError } from '../errors/NotUniqueError.js'
import { User, UserOutput } from './User.js'

interface Form {
	op: []
	href: string
	methodName: string
	contentType: string
}

interface Property {
	title: string
	type: string
	unit: string
	minimum: number
	maximum: number
	values: { value: string, date: Date }[]
	forms: Form[]
}

interface Action {
	title: string
	forms: Form[]
}

interface Event {
	title: string
	alertValue: number
	subscribers: string[]
	forms: Form[]
}

interface EventReturn {
	title: string
	alertValue: number
	isSubscribing: boolean
	forms: Form[]
}

interface PropertyReturn {
	value: string
	date: Date
}

interface ThingInput {
  '@context': string
  title: string
	id: string
	base: string
	description: string
	securityDefinitions: {
		bearer_sc: {
			scheme: string
		}
	}
	security: string
	properties: Property[]
	actions: Action[]
	events: Event[]
	forms: Form[]
}

interface ThingOutput {
  title: string
	id: string
	base: string
	description: string
	securityDefinitions: {
		bearer_sc: {
			scheme: string
		}
	}
	security: string
	properties: Property[]
	actions: Action[]
	events: EventReturn[]
	forms: Form[]
}

// An interface that describes the properties
// that a User Document has
interface ThingDoc extends mongoose.Document {
  '@context': string
  title: string
	id: string
	base: string
	description: string
	securityDefinitions: {
		bearer_sc: {
			scheme: string
		}
	}
	security: string
	properties: Property[]
	actions: Action[]
	events: Event[]
	forms: Form[]
}

// An interface that describes the properties
// that a User Model has
interface ThingModel extends mongoose.Model<ThingDoc> {
	build(thingInput: ThingInput): Promise<ThingOutput>
	getThings(userId: string): Promise<ThingOutput[]>
	getThing(thingId: string, userId: string): Promise<ThingOutput>
	addPropertyValue(thingId: string, property: string, value: string): Promise<void>
	getPropertyValues(thingId: string, property: string): Promise<PropertyReturn[]>
	subscribeToEvent(userId: string, thingId: string, eventName: string): Promise<void>
	unSubscribeToEvent(userId: string, thingId: string, eventName: string): Promise<void>
	getEventSubscribers(thingId: string, eventName: string): Promise<UserOutput>
	getAlertValue(thingId: string, eventName: string): Promise<number>	
}

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
thingSchema.statics.build = async (thingInput: ThingInput): Promise<ThingOutput> => {
	const thingExist = await Thing.exists({ thingId: thingInput.id })
	if (thingExist) throw new NotUniqueError('Thing')

	const thing = new Thing(thingInput)
	thing.save()

	return {
		title: thing.title,
		id: thing._id,
		base: thing.base,
		description: thing.description,
		securityDefinitions: {
			bearer_sc: {
				scheme: thing.securityDefinitions.bearer_sc.scheme
			}
		},
		security: thing.security,
		events: thing.events.map((event) => {
			return {
				title: event.title,
				alertValue: event.alertValue,
				isSubscribing: false,
				forms: event.forms
			}
		}),
		forms: thing.forms,
		properties: thing.properties,
		actions: thing.actions
	}
}

/**
 * To fetch all things in database
 *
 * @param {string} userId - Userid that will be used to set if user is subscribing to an event or not
 */
thingSchema.statics.getThings = async (userId: string): Promise<ThingOutput[]> => {
	const things = await Thing.find()

	const returnThings = things.map((thing: ThingDoc) => {
		const newEvents: EventReturn[] = thing.events.map((event) => {
			return {
				title: event.title,
				alertValue: event.alertValue,
				isSubscribing: event.subscribers.includes(userId),
				forms: event.forms
			}
		})

		return {
			title: thing.title,
			id: thing._id,
			base: thing.base,
			description: thing.description,
			securityDefinitions: {
				bearer_sc: {
					scheme: thing.securityDefinitions.bearer_sc.scheme
				}
			},
			security: thing.security,
			events: newEvents,
			forms: thing.forms,
			properties: thing.properties,
			actions: thing.actions
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
thingSchema.statics.getThing = async (thingId: string, userId: string): Promise<ThingOutput> => {
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const eventSubscriptions: EventReturn[] = thing.events.map(event => {
		return {
			title: event.title,
			alertValue: event.alertValue,
			isSubscribing: event.subscribers.includes(userId.toString()),
			forms: event.forms
		}
	})
	return {
		title: thing.title,
		id: thing._id,
		base: thing.base,
		description: thing.description,
		securityDefinitions: {
			bearer_sc: {
				scheme: thing.securityDefinitions.bearer_sc.scheme
			}
		},
		security: thing.security,
		events: eventSubscriptions,
		forms: thing.forms,
		properties: thing.properties,
		actions: thing.actions
	}
}

/**
 * Add a value to a specific property
 *
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} property - The property
 * @param {string} value - The value
 */
thingSchema.statics.addPropertyValue = async (thingId: string, property: string, value): Promise<void> => {
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const propertyData = thing.properties.find(prop => prop.title === property)
	if (!propertyData) throw new NoResourceIdError(thingId)

	propertyData.values.push({ value: value, date: new Date() })
	thing.save()
}

/**
 * Get the values for a specific property on a thing
 *
 * @param {string} thingId - Thing id for a specific thing
 * @param {string} property - The property
 */
thingSchema.statics.getPropertyValues = async (thingId: string, property: string): Promise<PropertyReturn[]> => {
	const numberOfValuesReturned = 100 // Quick fix, this should of course be a pagination
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const propertyData = thing.properties.find(prop => prop.title === property)
	if (!propertyData) throw new NoResourceIdError(thingId)

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
thingSchema.statics.subscribeToEvent = async (userId: string, thingId: string, eventName: string): Promise<void> => {
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const eventData = thing.events.find(event => event.title === eventName)
	if (!eventData) throw new NoResourceIdError(thingId)

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
thingSchema.statics.unSubscribeToEvent = async (userId: string, thingId: string, eventName: string): Promise<void> => {
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const eventData = thing.events.find(event => event.title === eventName)
	if (!eventData) throw new NoResourceIdError(thingId)

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
thingSchema.statics.getEventSubscribers = async (thingId: string, eventName: string): Promise<UserOutput[]> => {
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const eventData = thing.events.find(event => event.title === eventName)
	if (!eventData) throw new NoResourceIdError(thingId)

	const subscribers: UserOutput[] = []
	for (let i = 0; i < eventData.subscribers.length; i++) {
		const user = await User.getCurrentUser(eventData.subscribers[i])
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
thingSchema.statics.getAlertValue = async (thingId: string, eventName: string): Promise<number> => {
	const thing = await Thing.findOne({ id: thingId })
	if (!thing) throw new NoResourceIdError(thingId)

	const eventData = thing.events.find(event => event.title === eventName)
	if (!eventData) throw new NoResourceIdError(thingId)

	return eventData.alertValue
}

export const Thing = mongoose.model<ThingDoc, ThingModel>('Thing', thingSchema)
