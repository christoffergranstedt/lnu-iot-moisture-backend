import express from 'express'

import { homeController } from '../controllers/home.controllers.js'

export const router = express.Router()

// Routes for the startpage of the API
router.get('/', homeController.startEndpoint, responseHandler)
