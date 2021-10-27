import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import { UnauthenticatedError, UsernameIsTakenError, WrongCredentialsError, WrongRefreshTokenError } from '../errors/index.js'
import { PermissionLevel } from '../constants/PermissionLevel'


// An interface that describes the properties
// that are requried to create a new User
interface UserInput {
  username: string
  password: string
	permissionLevel?: PermissionLevel.Admin | PermissionLevel.User
	telegramId?: string
}

interface RefreshTokenAuth {
	userId: string,
	refreshToken: string
}

interface UserOutput {
	id: string
	username: string
	permissonLevel?: PermissionLevel.Admin | PermissionLevel.User
	telegramId?: string
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  username: string
  password: string
	permissonLevel: PermissionLevel.Admin | PermissionLevel.User
	refreshToken: string
	telegramId: string
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(userInput: UserInput): Promise<UserOutput>
	adminBuild(userInput: UserInput) : Promise<UserOutput>
	authenticate(userInput: UserInput) : Promise<UserOutput>
	authenticateRefreshToken(refreshTokenAttributes: RefreshTokenAuth) : Promise<UserOutput>
	storeRefreshToken(refreshTokenAttributes: RefreshTokenAuth) : Promise<UserOutput>
	getCurrentUser(userId: string) : Promise<UserOutput>
	addTelegramId(userId: string, telegramId: string) : Promise<UserOutput>
	
}


const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			unique: false
		},
		permissonLevel: {
			type: PermissionLevel,
			required: true,
			default: PermissionLevel.User
		},
		refreshToken: {
			type: String,
			required: false,
			unique: false
		},
		telegramId: {
			type: String
		}
	}
)

/**
 * To build a new user
 *
 * @param {string} userInput - User attributes
 */
 userSchema.statics.build = async (userInput: UserInput) : Promise<UserOutput> => {
	const userExist = await User.exists({ username: userInput.username })
	if (userExist) throw new UsernameIsTakenError()
	userInput.password = await bcrypt.hash(userInput.password, 10)
	const user = new User(userInput)
	user.save()

	return {
		id: user._id,
		username: user.username,
	}
}

/**
 * Build an admin user
 *
 * @param {string} userId - The user id for the user
 */
 userSchema.statics.adminBuild = async (userInput: UserInput): Promise<UserOutput> => {
	const userExist = await User.exists({ username: userInput.username })
	if (userExist) throw new UsernameIsTakenError()
	userInput.password = await bcrypt.hash(userInput.password, 10)
	const user = new User(userInput)
	user.save()

	return {
		id: user._id,
		username: user.username
	}
}

/**
 * To autneticate a user
 *
 * @param {string} userInput - User attributes
 */
 userSchema.statics.authenticate = async (userInput: UserInput) : Promise<UserOutput> => {
	const userExist = await User.exists({ username: userInput.username })
	if (!userExist) throw new WrongCredentialsError()
	const user = await User.findOne({ username: userInput.username })
	if (!user || !await bcrypt.compare(userInput.password, user.password)) throw new WrongCredentialsError()

	return {
		id: user._id,
		username: user.username
	}
}

/**
 * To autneticate a refresh token for a user
 *
 * @param {string} refreshTokenAttributes - refresh token attributes container userId and refreshToken
 */
 userSchema.statics.authenticateRefreshToken = async (refreshTokenAttributes: RefreshTokenAuth) : Promise<UserOutput> => {
	const user = await User.findById(refreshTokenAttributes.userId)
	if (!user || !await bcrypt.compare(refreshTokenAttributes.refreshToken, user.refreshToken)) throw new WrongRefreshTokenError()

	return {
		id: user._id,
		username: user.username
	}
}

/**
 * To store the refresh token for a user
 *
 * @param {string} refreshTokenAttributes - refresh token attributes container userId and refreshToken
 */
 userSchema.statics.storeRefreshToken = async (refreshTokenAttributes: RefreshTokenAuth) : Promise<UserOutput> => {
	const user = await User.findById(refreshTokenAttributes.userId)
	if (!user) throw new UnauthenticatedError()
	const hashedRefreshToken = await bcrypt.hash(refreshTokenAttributes.refreshToken, 10)
	user.refreshToken = hashedRefreshToken
	user.save()

	return {
		id: user._id,
		username: user.username,
	}
}

/**
 * To get a specific user
 *
 * @param {string} userId - The user id for the user
 */
 userSchema.statics.getCurrentUser = async (userId: string) : Promise<UserOutput>  => {
	const user = await User.findById(userId)
	if (!user) throw new UnauthenticatedError()

	return {
		id: user._id,
		username: user.username
	}
}

/**
 * Add Telegram id to a user
 *
 * @param {string} userId - The user id for the user
 * @param {string} telegramId - The telegram id for the user
 */
userSchema.statics.addTelegramId = async (userId, telegramId): Promise<UserOutput> => {
	const user = await User.findById(userId)
	if (!user) throw new UnauthenticatedError()
	user.telegramId = telegramId
	user.save()

	return {
		id: user._id,
		username: user.username,
		permissonLevel: user.permissonLevel,
		telegramId: user.telegramId
	}
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User, UserDoc }
