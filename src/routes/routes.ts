import express from 'express'
import { router as homeRouter } from './home.routes'
import { router as accountsRouter } from './account.routes'
import { router as thingsRouter } from './thing.routes'
import { router as propertiesRouter } from './property.routes'
import { router as eventsRouter } from './event.routes'
import { router as actionsRouter } from './action.routes'

export const router = express.Router()

// Main routes for different resources
router.use('/', homeRouter)
router.use('/accounts', accountsRouter)
router.use('/things', thingsRouter)
router.use('/things/:thingId/properties', propertiesRouter)
router.use('/things/:thingId/events', eventsRouter)
router.use('/things/:thingId/actions', actionsRouter)
