const express = require ('express')
const router = express.Router()
const board_controller = require ('../controller/board_controller')

//Board Routes

//Show existing boards already created by User
router.get('/api/user/:user', board_controller.findByUserId)

//View existing board based on ID
router.get('/api/boards/:id', board_controller.findByBoardId)

//Create new board based on ID
router.post('/api/boards', board_controller.createBoard)

//Update existing board based on ID
router.patch('/api/boards/:id', board_controller.updateBoard)

//Delete existing board based on ID
router.delete('/api/boards/:id', board_controller.deleteBoard)


module.exports = router
