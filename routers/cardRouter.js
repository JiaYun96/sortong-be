const express = require ('express')
const router = express.Router()
const card_controller = require ('../controller/card_controller')

//Card Routes

//View existing card based on ID // OK
router.get('/:userID/:boardID/:id', card_controller.findByCardId)

//Create new card // OK
router.post('/:userID/:boardID', card_controller.createCard)

//Update existing card based on ID 
router.patch('/:userID/:boardID', card_controller.updateCard)

//Delete existing card based on ID // OK
router.delete('/:userID/:boardID/:id', card_controller.deleteCard)

module.exports = router