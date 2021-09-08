const express = require ('express')
const router = express.Router()
const board_controller = require ('../controller/board_controller')

//Board Routes

//Show existing boards already created by User
router.get('/:userID/home', board_controller.showBoard)

//Create new board based on ID
router.post('/:userID/home', board_controller.createBoard)

//Update existing board based on ID
router.patch('/:userID/home', board_controller.updateBoard)

//Delete existing board based on ID
router.delete('/:userID/home', board_controller.deleteBoard)

module.exports = router