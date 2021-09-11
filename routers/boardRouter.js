const express = require ('express')
const router = express.Router()
const board_controller = require ('../controller/board_controller')

//Board Routes

//Show existing boards already created by User // OK
router.get('/:userID', board_controller.findByUserId)

//View existing board based on ID // OK
router.get('/:userID/:boardID', board_controller.findByBoardId)

//Create new board based on ID // OK
router.post('/:userID', board_controller.createBoard)

//Update existing board based on ID 
router.patch('/:userID', board_controller.updateBoard)

//Delete existing board based on ID // OK
router.delete('/:userID/:boardID', board_controller.deleteBoard)


module.exports = router
