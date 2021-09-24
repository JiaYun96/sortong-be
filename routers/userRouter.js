const express = require ('express')
const router = express.Router()
const user_controller = require ('../controller/user_controller')

// User Routes

// Register/Create New User
router.post('/register', user_controller.register)

// Login Existing User 
router.post('/login', user_controller.login)


module.exports = router


//hello world

// router.get('/test', auth, (req, res) => {
//     console.log('hello is this working')
//     res.send("hello is this working")
// })
