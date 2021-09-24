const express = require ('express')
const router = express.Router()
const board_controller = require ('../controller/board_controller')
const auth = require("../middleware/auth")

// Board Routes

//Show all existing boards of an User // OK
router.get('/:userId', auth, board_controller.findAllBoards)

//View specific board of an User // OK
router.get('/:userId/:boardId', auth, board_controller.findByBoardId)

//Create new board for an User // OK
router.post('/:userId', auth, board_controller.createBoard)

//Update existing board for an User // OK
router.patch('/:userId/:boardId', auth, board_controller.updateBoard)

//Delete existing board of an User // OK
router.delete('/:userId/:boardId', auth, board_controller.deleteBoard)


module.exports = router
