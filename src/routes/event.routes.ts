import express from 'express'

import { getEvents, getEvent, subscribeEvent, unSubscribeEvent, createEvent, updateEvent, deleteEvent } from '../controllers/event.controller'
import { validate, validateEvent } from '../middlewares/validateInput'
import { verifyAccessToken } from '../middlewares/verifyToken'

export const router = express.Router({ mergeParams: true })

router.get('/', verifyAccessToken, getEvents)
router.get('/:eventName', verifyAccessToken, getEvent)
router.post('/:eventName/subscribe', verifyAccessToken, subscribeEvent)
router.delete('/:eventName/unsubscribe', verifyAccessToken, unSubscribeEvent)
router.post('/', verifyAccessToken, validateEvent, validate, createEvent)
router.put('/:eventName', verifyAccessToken, validateEvent, validate, updateEvent)
router.delete('/:eventName', verifyAccessToken, deleteEvent)
