const express = require('express')
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const cors = require('cors')
const db = require("../database/config")
const userRouter = require('../users/users-router');
const logger = require('../middleware/logger')
const server = express();

server.use(cors())
server.use(express.json());
server.use(session({
	resave: false, 
	saveUninitialized: false, 
	secret: "keep it secret, keep it safe",
	store: new KnexSessionStore({
		knex: db, 
		createtable: true,
	}),
}))
server.use(logger())

server.use(userRouter);

server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

module.exports = server;