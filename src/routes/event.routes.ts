import express from 'express'

import { eventsController } from '../controllers/event.controller.js'
import { validateInput } from '../middlewares/validateInput.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'

export const router = express.Router({ mergeParams: true })

router.get('/', verifyAccessToken, eventsController.getEvents, responseHandler)
router.get('/:eventName', verifyAccessToken, eventsController.getEvent, responseHandler)
router.post('/:eventName/subscribe', verifyAccessToken, eventsController.subscribeEvent, responseHandler)
router.delete('/:eventName/unsubscribe', verifyAccessToken, eventsController.unSubscribeEvent, responseHandler)
router.post('/', verifyAccessToken, validateInput.event, validateInput.validate, eventsController.createEvent, responseHandler)
router.put('/:eventName', verifyAccessToken, validateInput.event, validateInput.validate, eventsController.updateEvent, responseHandler)
router.delete('/:eventName', verifyAccessToken, eventsController.deleteEvent, responseHandler)
