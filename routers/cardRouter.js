const express = require ('express')
const router = express.Router()
const card_controller = require ('../controller/card_controller')
const auth = require("../middleware/auth")

//Card Routes

//Show all existing cards of a board
router.get('/:userId/:boardId', auth, card_controller.findAllCards)

//View specific card of a board
router.get('/:userId/:boardId/:id', auth, card_controller.findByCardId)

//Create new card for a board
router.post('/:userId/:boardId', auth, card_controller.createCard)

//Update existing card of a board
router.patch('/:userId/:boardId/:id', auth, card_controller.updateCard)

//Delete existing card of a board
router.delete('/:userId/:boardId/:id', auth, card_controller.deleteCard)



module.exports = router

//Card Routes

// //View existing card based on Id // OK
// router.get('/:userId/:boardId/:id', card_controller.findByCardId)

// //Create new card // OK
// router.post('/:userId/:boardId', card_controller.createCard)

// //Update existing card based on Id 
// router.patch('/:userId/:boardId/:id', card_controller.updateCard)

// //Delete existing card based on Id // OK
// router.delete('/:userId/:boardId/:id', card_controller.deleteCard)

module.exports = router