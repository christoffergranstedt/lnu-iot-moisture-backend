import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction  } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'

import { NotFoundError } from './errors/index'
import { router as routes } from './routes/routes'
import { apiRateLimiter } from './middlewares/rateLimiter'
import { Mongoose } from './config/mongoose'
import { errorHandler } from './middlewares/errorHandler'
import { mqttClient } from './config/mqtt/MQTTClient'
import { AppGlobal } from './constants/AppGlobal'
import { publishMoistureLevelLoop } from './config/publishMoistureLevel'
// import { mqttClient } from './config/mqtt/mqtt.js'

const { PORT } = process.env

const app = express()
app.use(express.json())
app.use(logger('dev'))

app.use(cors({ origin: process.env.REACT_APP_URL }))

// A simple rate limiter that only limit the number of requests from a IP-adress
app.use(apiRateLimiter)

// Instansiate helmet package for extra security layer.
app.use(helmet())

app.use((_req: Request, res: Response, next: NextFunction) => {
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS')
	next()
})

// Different routes
app.use('/api', routes)

// Handle all request methods and routes that are not supported and return a NotFoundError
app.all('*', async (_req: Request, _res: Response, next: NextFunction) => {
	next(new NotFoundError())
})

// Handle all errors on the server
app.use(errorHandler)

// Start the server and database
const connectToDbAndServer = async () => {
	try {
		await app.listen(PORT, async () => {
			await new Mongoose().connect()
			publishMoistureLevelLoop.start()
			app.set(AppGlobal.MqttClient, mqttClient)
			// mqttClient.connect() - Disabled for now since I have paused my CloudMQTT Broker

			console.log(`Server running on port ${PORT}`)
		})
	} catch (error) {
		console.log('Something went wrong when connecting to database or server')
	}
}

connectToDbAndServer()
