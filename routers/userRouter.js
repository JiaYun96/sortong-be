const express = require ('express')
const router = express.Router()
const user_controller = require ('../controller/user_controller')

//User account routes

// Register new account
router.post('/register', user_controller.register)

// Login using account
router.post('/login', user_controller.login)

module.exports = router