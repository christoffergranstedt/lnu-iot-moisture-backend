import express from 'express'

import { startEndpoint } from '../controllers/home.controllers'

export const router = express.Router()

// Routes for the startpage of the API
router.get('/', startEndpoint)
