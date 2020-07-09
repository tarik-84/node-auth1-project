const express = require('express')
const bcrypt = require('bcryptjs')
const data = require('./users-model')
const restrict = require('../middleware/restrict')


const router = express.Router()

router.get('/users', restrict(), async (req, res, next) => {
    try {
      const users = await data.find()
      res.json(users)
    } catch(err) {
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
    try {
		const { username, password } = req.body
		const user = await data.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await data.add({
			username,
			password: await bcrypt.hash(password, 14),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post('/login', async (req, res, next) => {
    try {
		const { username, password } = req.body
		const user = await data.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		req.session.user = user

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get('/logout', async (req, res, next) => {
    try {
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router