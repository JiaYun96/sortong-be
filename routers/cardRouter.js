const express = require ('express')
const router = express.Router()
const card_controller = require ('../controller/card_controller')

//Card Routes

//View existing card based on ID
router.get('/api/boards/:id', card_controller.findByCardId)

//Create new card
router.post('/api/boards/:id', card_controller.createCard)

//Update existing card based on ID
router.patch('/api/boards/:id', card_controller.updateCard)

//Delete existing card based on ID
router.delete('/api/boards/:id', card_controller.deleteCard)

module.exports = router
