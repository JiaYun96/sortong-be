const express = require ('express')
const router = express.Router()
const list_controller = require ('../controller/list_controller')

//List routes

//Filter cards with 'Pending' status by BoardID
router.get('/api/boards/:id', list_controller.findByCardPending)

//Filter cards with 'Doing' status by BoardID
router.get('/api/boards/:id', list_controller.findByCardDoing)

//Filter cards with 'Completed' status by BoardID
router.get('/api/boards/:id', list_controller.findByCardCompleted)

module.exports = router