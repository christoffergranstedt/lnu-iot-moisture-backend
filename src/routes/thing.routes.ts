import express from 'express'

import { thingsController } from '../controllers/thing.controllers.js'
import { validateInput } from '../middlewares/validateInput.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'

export const router = express.Router()

router.get('/', verifyAccessToken, thingsController.getThings, responseHandler)
router.get('/:thingId', verifyAccessToken, thingsController.getThing, responseHandler)
router.post('/', verifyAccessToken, validateInput.thing, validateInput.validate, thingsController.createThing, responseHandler)
router.put('/:thingId', verifyAccessToken, validateInput.thing, validateInput.validate, thingsController.updateThing, responseHandler)
router.delete('/:thingId', verifyAccessToken, thingsController.deleteThing, responseHandler)
