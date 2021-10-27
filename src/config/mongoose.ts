import mongoose from 'mongoose'
import fs from 'fs'

import { User } from '../models/User'
import { Thing } from '../models/Thing'
import { PermissionLevel } from '../constants/PermissionLevel'


export class Mongoose {

	/**
	 * To connect to mongoose
	 *
	 */
	public async connect (): Promise<void>  {
		if (!process.env.MONGO_URI) {
			throw new Error('MONGO_URI must be defined')
		}
		mongoose.connection.on('connected', async () => {
			console.log('Connected to MongoDB database.')
			await this.prePopulateDatabase()
		})
		mongoose.connection.on('disconnected', () => console.log('Mongo DB is disconnected'))
		mongoose.connection.on('error', error => console.log(error.message))

		mongoose.connect(process.env.MONGO_URI, { socketTimeoutMS: 10000 })
	}

	/**
	 * To close the connection to mongoose
	 *
	 */
	public close (): void {
		try {
			mongoose.connection.close(() => {
				console.log('Mongoose connection is disconnected due to application termination.')
			})
		} catch (error) {
			console.log('Error when closing mongoose')
		}
	}

	/**
	 * To populate the database if it empty
	 *
	 */
	private async prePopulateDatabase () {
		const { ADMIN_USERNAME, ADMIN_PASSWORD, GUEST_USERNAME, GUEST_PASSWORD, TELEGRAM_ADMIN_ID, NODE_ENV } = process.env
		if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !GUEST_USERNAME || !GUEST_PASSWORD || !TELEGRAM_ADMIN_ID || !NODE_ENV) throw new Error('Database environment variables is incorrect and missing') 

		const filepath = NODE_ENV === 'development' ? './src/models/thingDescriptions/moistureThing-development.td.json' : './src/models/thingDescriptions/moistureThing.td.json'
		const myMoistureThing = JSON.parse(fs.readFileSync(filepath).toString())

		const adminExist = await User.exists({ username: ADMIN_USERNAME })
		if (!adminExist) {
			await User.adminBuild({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD, permissionLevel: PermissionLevel.Admin, telegramId: TELEGRAM_ADMIN_ID })
		}

		const guestExist = await User.exists({ username: GUEST_USERNAME })
		if (!guestExist) {
			await User.build({ username: GUEST_USERNAME, password: GUEST_PASSWORD })
		}

		const thingExist = await Thing.exists({ id: myMoistureThing.id })
		if (!thingExist) {
			const properties = []
			const events = []
			const actions = []
			for (const [, value] of Object.entries(myMoistureThing.properties)) {
				properties.push(value)
			}
			for (const [, value] of Object.entries(myMoistureThing.events)) {
				events.push(value)
			}
			for (const [, value] of Object.entries(myMoistureThing.actions)) {
				actions.push(value)
			}
			myMoistureThing.properties = properties
			myMoistureThing.actions = actions
			myMoistureThing.events = events

			await Thing.build(myMoistureThing)
		}
	}

}
