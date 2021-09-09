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


const mongoose = require('mongoose') // Usually for validation of mongo objectID
const { BoardModel } = require('../models/board')
const { CardModel } = require('../models/card')

module.exports = {

    // Show existing boards
    findByUserId: (req, res) => {
        BoardModel.find({ users: req.params.userID }).populate('cards')
        .then(response => {
            if(!response){
                return res.status(404).json()
            }
            return res.json(response)
        })
        .catch (error => {
            console.log(error);
            return res.status(500).json()
        })

    },

    // Show 1 existing board
    findByBoardId: (req, res) => {
        BoardModel.findOne({ _id: req.params.id }).populate('cards')
        .then((board) => res.json(board))
        .catch((err) => res.json(err))
    },

    // Create new board
    createBoard: (req, res) => {
        const board = {
            name: req.body.name,
            user: req.body.user,
            cards: req.body.cards,
        }

        BoardModel.create(board)
            .then((board) => {
                res.json({ board });
            })
            .catch((err) => res.status(400).json(err))
    },

    // Update board
    updateBoard: (req, res) => {
        BoardModel.updateOne({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })
        .then((res) => res.json(res))
        .catch((err) => res.status(400).json(err))

    },

    // Delete board
    deleteBoard: async (req, res) => {
        try{
        const board = await BoardModel.findOne({ _id: req.params.id })

        // Delete all cards in board
        for(let i=0; i < board.cards.length; i++) {
            await CardModel.deleteOne( { _id: board.cards[i]._id })
        }

        // Delete the board itself
        const response = await BoardModel.deleteOne({ _id: req.params.id })
        res.json(res)

        }catch(err){
            res.status(400).json(err)
        }
    }


}
