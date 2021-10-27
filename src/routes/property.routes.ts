import express from 'express'

import { propertiesController } from '../controllers/property.controller.js'
import { validateInput } from '../middlewares/validateInput.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'

export const router = express.Router({ mergeParams: true })

router.get('/', verifyAccessToken, propertiesController.getProperties, responseHandler)
router.get('/:propertyName', verifyAccessToken, propertiesController.getProperty, responseHandler)
router.get('/:propertyName/values', verifyAccessToken, propertiesController.getPropertyValues, responseHandler)
router.post('/', verifyAccessToken, validateInput.property, validateInput.validate, propertiesController.createProperty, responseHandler)
router.put('/:propertyName', verifyAccessToken, validateInput.property, validateInput.validate, propertiesController.updateProperty, responseHandler)
router.delete('/:propertyName', verifyAccessToken, propertiesController.deleteProperty, responseHandler)
