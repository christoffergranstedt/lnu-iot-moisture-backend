import express from 'express'

import { getActions, getAction, createAction, invokeAction, updateAction, deleteAction } from '../controllers/action.controllers.js'
import { validate, validateAction } from '../middlewares/validateInput.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'

export const router = express.Router({ mergeParams: true })

router.get('/', verifyAccessToken, getActions)
router.get('/:actionName', verifyAccessToken, getAction)
router.post('/', verifyAccessToken, validateAction, validate, createAction)
router.post('/:actionName', verifyAccessToken, validateAction, validate, invokeAction)
router.put('/:actionName', verifyAccessToken, validateAction, validate, updateAction)
router.delete('/:actionName', verifyAccessToken, deleteAction)
