import express from 'express'

import { authenticateUser, registerUser, signoutUser, refreshAccessToken, telegramSetup } from '../controllers/account.controllers'
import { validate, validateUser } from '../middlewares/validateInput'
import { verifyAdminToken } from '../middlewares/verifyAdminToken'
import { verifyAccessToken } from '../middlewares/verifyToken'

export const router = express.Router()

// Routes for the Account resoruces
router.post('/authenticate', validateUser, validate, authenticateUser)
router.post('/register', verifyAdminToken, validateUser, validate, registerUser)
router.get('/signout', verifyAccessToken, signoutUser)
router.post('/refresh', refreshAccessToken)
router.post(`/${process.env.SEMI_HIDDEN_ROUTE}`, telegramSetup)
