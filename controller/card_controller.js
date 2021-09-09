const mongoose = require('mongoose') // Usually for validation of mongo objectID
const { BoardModel } = require('../models/board')
const { CardModel } = require('../models/card')

module.exports = { 

    // View Existing Card
    findByCardId: (req, res) => {
        CardModel.findOne( {_id: req.params.id} )
        .then (response => {
            if(!response) {
                return res.status(404).json({message: "Card not found."})
            }
            return res.json(response)
        })
        .catch(error => {
            return res.status(500).json(error)
        })
    },

    // Create New Card
    createCard: async (req, res) => {
        try{
            //Get board ID from the body
            const boardID = req.body.boardID;

            const newCard = {
                cardTitle: req.body.name,
                cardDescription: req.body.description,
                status: "0", // Default status for 'Pending' = 0
                board: req.body.boardID,
            }
            
            const card = await CardModel.create(newCard)
            
            //Link card to the board
            await BoardModel.updateOne(
                { _id: boardID }, 
                { $push: {cards: card._id} }
            )

            res.json( {card} )
        
        } catch(err) {
            return res.status(400).json(error)
        }
    },

    // Update Existing Card
    updateCard: (req, res) => {
        CardModel.updateOne({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })
        .then (response => {
            if(!response) {
                return res.status(404).json({message: "Update Card Error"})
            }
            return res.json(response)
        })
        .catch(error => {
            return res.status(400).json(error)
        })
    },

    // Delete Existing Card
    deleteCard: (req, res) => {
        CardModel.deleteOne( { _id: req.params.id })
        .then (response => {
            if(!response) {
                return res.status(404).json({message: "Delete Card Error"})
            }
            return res.json(response)
        })
        .catch(error => {
            return res.status(500).json(error)
        })
    },

}
