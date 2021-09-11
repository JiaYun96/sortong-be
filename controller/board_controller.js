const mongoose = require('mongoose') // Usually for validation of mongo objectID
const { BoardModel } = require('../models/board')
const { CardModel } = require('../models/card')
const { UserModel } = require('../models/user')

module.exports = {

    // Show existing boards
    findByUserId: (req, res) => {
        BoardModel.find({ users: req.params.userID }).populate('cards')
            .then(response => {
                if (!response) {
                    return res.status(404).json()
                }
                return res.json(response)
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json()
            })
    },

    // Show 1 existing board
    findByBoardId: (req, res) => {
        console.log(req.params)
        BoardModel.findOne({ _id: req.params.boardID })
            .then(response => {
                if (!response) {
                    return res.status(404).json({ message: "Board not found." })
                }
                return res.json(response)
            })
            .catch(error => {
                return res.status(500).json(error)
            })
    },

    // Create new board
    createBoard: (req, res) => {
        console.log("BOARD CREATED")
        console.log(req.body)
        console.log(req.params)

        const board = {
            title: req.body.title,
            userID: req.params.userID,
        }

        BoardModel.create(board)
            .then(async (boards) => {
                await UserModel.findOneAndUpdate(
                    { _id: req.params.userID },
                    { $push: { board: boards._id } },
                )
                res.json(boards);
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
        console.log(req.params)

        try {
            const board = await BoardModel.findOne({ _id: req.params.boardID })
            
            await CardModel.deleteMany({ boardID: req.params.boardID })

            // // Delete all cards in board 
            // for (let i = 0; i < board.cards.length; i++) {
            //     await CardModel.deleteOne({ _id: board.cards[i]._id })
            // }

            // Delete the board itself
            await BoardModel.deleteOne({ _id: req.params.boardID })

            // Delete the board from User Board Array
            await UserModel.findOneAndUpdate({ _id: req.params.userID }, { $pull: { board: req.params.boardID } })

            return res.json()
        } catch (err) {
            res.status(400).json(err)
        }
    }


}
