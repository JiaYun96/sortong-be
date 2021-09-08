const express = require ('express')
const router = express.Router()
const card_controller = require ('../controller/card_controller')

//Card Routes

//Show existing boards already created by User
router.get('/:boardID/', board_controller.showCard)

//Create new board based on ID
router.post('/:userID/home', board_controller.createCard)

//Update existing board based on ID
router.patch('/:userID/home', board_controller.updateCard)

//Delete existing board based on ID
router.delete('/:userID/home', board_controller.deleteCard)

module.exports = router