const express = require ('express')
const router = express.Router()
const user_controller = require ('../controller/user_controller')

//hello world

router.get('/hello', (req, res) => {
    res.send("hello is this working")
})

//User account routes

// Register new account // OK
router.post('/register', user_controller.register)

// Login using account // OK (email + password)
router.post('/login', user_controller.login)

module.exports = router