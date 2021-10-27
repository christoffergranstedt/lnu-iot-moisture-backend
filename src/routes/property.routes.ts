import express from 'express'

import { getProperties, getProperty, getPropertyValues, createProperty, updateProperty, deleteProperty } from '../controllers/property.controller'
import { validate, validateProperty } from '../middlewares/validateInput'
import { verifyAccessToken } from '../middlewares/verifyToken'

export const router = express.Router({ mergeParams: true })

router.get('/', verifyAccessToken, getProperties)
router.get('/:propertyName', verifyAccessToken, getProperty)
router.get('/:propertyName/values', verifyAccessToken, getPropertyValues)
router.post('/', verifyAccessToken, validateProperty, validate, createProperty)
router.put('/:propertyName', verifyAccessToken, validateProperty, validate, updateProperty)
router.delete('/:propertyName', verifyAccessToken, deleteProperty)
