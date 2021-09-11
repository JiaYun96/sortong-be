const mongoose = require('mongoose') // Usually for validation of mongo objectID
const { BoardModel } = require('../models/board')
const { CardModel } = require('../models/card')

module.exports = {

    // View Existing Card
    findByCardId: (req, res) => {
        console.log(req.params)
        CardModel.findOne({ _id: req.params.id })
            .then(response => {
                if (!response) {
                    return res.status(404).json({ message: "Card not found." })
                }
                return res.json(response)
            })
            .catch(error => {
                return res.status(500).json(error)
            })
    },

    // Create New Card
    createCard: (req, res) => {
        const newCard = {
            cardTitle: req.body.cardTitle,
            cardDescription: req.body.cardDescription,
            status: req.body.status, // Default status for 'Pending' = 0
            boardID: req.params.boardID
        }

        CardModel.create(newCard)
            .then(async (cards) => {
                await BoardModel.findOneAndUpdate(
                    { _id: req.params.boardID },
                    { $push: { col1: cards._id } },
                )
                res.json(cards);
            })
            .catch((err) => res.status(400).json(err))
    },

    // Update Existing Card
    updateCard: (req, res) => {
        CardModel.updateOne({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })
            .then(response => {
                if (!response) {
                    return res.status(404).json({ message: "Update Card Error" })
                }
                return res.json(response)
            })
            .catch(error => {
                return res.status(400).json(error)
            })
    },

    // Delete Existing Card
    deleteCard: async (req, res) => {

        console.log(req.params)

        try {
            await CardModel.deleteOne({ _id: req.params.id })

            await BoardModel.findOneAndUpdate({ _id: req.params.boardID },
                { $pull: { col1: req.params.id , col2: req.params.id , col3: req.params.id} }
            )

            return res.json()

        } catch (err) {
            res.status(400).json(err)
        }
    }
}
