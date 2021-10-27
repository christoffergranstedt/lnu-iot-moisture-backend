import express from 'express'

import { getThings, getThing, createThing, updateThing, deleteThing } from '../controllers/thing.controllers'
import { validate, validateThing } from '../middlewares/validateInput'
import { verifyAccessToken } from '../middlewares/verifyToken'

export const router = express.Router()

router.get('/', verifyAccessToken, getThings)
router.get('/:thingId', verifyAccessToken, getThing)
router.post('/', verifyAccessToken, validateThing, validate, createThing)
router.put('/:thingId', verifyAccessToken, validateThing, validate, updateThing)
router.delete('/:thingId', verifyAccessToken, deleteThing)
