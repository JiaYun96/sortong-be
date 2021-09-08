const express = require ('express')
const router = express.Router()
const list_controller = require ('../controller/list_controller')

//User account routes
router.post('/register', list_controller.register)
router.post('/login', list_controller.login)

module.exports = router