const mongoose = require('mongoose') // Usually for validation of mongo objectId
const { BoardModel } = require('../models/board')
const { CardModel } = require('../models/card')
const { v4: uuid } = require('uuid');
const { createCardDataValidate, updateCardDataValidate } = require('../middleware/dataValidator')

module.exports = {

    // Show existing cards of board
    findAllCards: async (req, res) => {
        try {
            const { userId, boardId } = req.params;

            // Data sanitization
            const sanitizedUserId = userId.trim()
            const sanitizedBoardId = boardId.trim()

            // Data validation
            if (!sanitizedUserId && !sanitizedBoardId) {
                return res.status(400).json({
                    success: false,
                    message: 'Provide required values to fetch all cards of the board.'
                })
            }

            // Getting all cards of the board
            const boardCards = await CardModel.find({ boardId: sanitizedBoardId });
            if (boardCards) {

                // Sending final data to frontend side
                return res.status(200).json({
                    success: true,
                    data: boardCards.length ? boardCards : []
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "unable to find cards"
                })
            }
        } catch (error) {
            console.log('Error while fetching all cards of the board : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    // Logic ends



    // Show single existing card
    findByCardId: async (req, res) => {
        try {
            const { boardId, id } = req.params

            // Data sanitization
            const sanitizedBoardId = boardId.trim()
            const sanitizedCardId = id.trim()

            // Data validation
            if (!sanitizedBoardId || !sanitizedCardId) {
                return res.status(400).json({
                    success: false,
                    message: 'Provide required values to fetch a card of the baord.'
                })
            }

            const cardDetails = await CardModel.findOne({ cardId: sanitizedCardId })
            if (cardDetails && cardDetails.boardId == sanitizedBoardId) {

                // Sending final data to frontend side
                return res.status(200).json({
                    success: true,
                    data: cardDetails
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Unable to find the Card"
                })
            }
        } catch (error) {
            console.log('Error while fetching a Card of the baord : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    // Logic ends




    // Create new card for board
    createCard: async (req, res) => {

        try {
            const { title, desc } = req.body;
            const { boardId } = req.params;
            const cardId = uuid(); // unique card Id

            // Data sanitization
            const dataForValidation = {
                boardId: boardId.trim(),
                cardId: cardId.trim(),
                title: title.trim(),
                desc: desc.trim()
            }

            // Data Validation
            const { error, value } = createCardDataValidate.validate(dataForValidation)
            if (error) {
                const errMsg = (error && error.details && error.details.length && error.details[0].message) || "Data validation failed"
                return res.status(400).json({
                    success: false,
                    message: errMsg
                });
            }

            // Creating Data for adding an new card
            const card = {
                boardId: value.boardId,
                cardId: value.cardId,
                cardTitle: value.title,
                cardDescription: value.desc
            }

            // Creating a new card
            const newCard = await CardModel.create(card);
            if (newCard && newCard._id) {

                // Updated the Board with newly created card
                const updatedBoard = await BoardModel.findOneAndUpdate(
                    { boardId: boardId },
                    { $push: { cards: newCard.cardId } }
                )

                // If success then, sending final success response
                if (updatedBoard) {
                    return res.status(200).json({
                        success: true,
                        data: newCard
                    });
                } else {
                    return res.status(424).json({
                        success: false,
                        message: 'Failed to create a Card for the Board'
                    })
                }
            } else {
                return res.status(422).json({
                    success: false,
                    message: 'Failed to create a Card'
                })
            }
        } catch (error) {
            console.log('Error while Creating a NEW Card for the user : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }

    },
    // Logic ends




    //Update existing card in a board
    updateCard: async (req, res) => {

        try {
            const { title, desc, status, index } = req.body
            const { boardId, id } = req.params

            // Data sanitization
            const dataForValidation = {
                boardId: boardId.trim(),
                cardId: id.trim()
            }
            if (title) dataForValidation.title = title.trim()
            if (desc) dataForValidation.desc = desc.trim()
            if (status) dataForValidation.status = status
            if (index) dataForValidation.index = index

            // Data Validation
            const { error, value } = updateCardDataValidate.validate(dataForValidation)
            if (error) {
                const errMsg = (error && error.details && error.details.length && error.details[0].message) || "Data validation failed"
                return res.status(400).json({
                    success: false,
                    message: errMsg
                });
            }

            // Creating Data for updating card
            const dataToUpdate = {};

            if (value.title) dataToUpdate.cardTitle = value.title;
            if (value.desc) dataToUpdate.cardDescription = value.desc;
            if (value.status) dataToUpdate.cardStatus = value.status;
            // if (value.index) dataToUpdate.cardIndex = value.index;

            // Updating an existing Card
            const updatedCard = await CardModel.updateOne(
                { cardId: value.cardId },
                {
                    $set: { ...dataToUpdate }
                },
                { returnNewDocument: true, omitUndefined: true }
            )

            if (updatedCard) {

                // Sending Success Response to the frontend side
                if (updatedCard.nModified && updatedCard.nModified === 1) {
                    return res.status(200).json({
                        success: true,
                        message: "Card Details Updated"
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "No new data to update"
                    });
                }
            } else {
                return res.status(422).json({
                    success: false,
                    message: "Failed to update card"
                });
            }
        }
        catch (error) {
            console.log('Error while Updating a Card : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    // Logic ends




    // Delete existing card
    deleteCard: async (req, res) => {
        try {

            const { boardId, id } = req.params;

            // Data sanitization
            const sanitizedBoardId = boardId.trim()
            const sanitizedCardId = id.trim()

            // Data validation
            if (!sanitizedBoardId || !sanitizedCardId) {
                return res.status(400).json({
                    success: false,
                    message: 'Provide required values to delete a card.'
                })
            }

            // Deleting the Card
            const deletedCardResp = await CardModel.deleteOne({ cardId: sanitizedCardId })
            if (deletedCardResp && deletedCardResp.deletedCount && deletedCardResp.deletedCount == 1) {

                // Removing Card from Board details
                const updatedBoard = await BoardModel.findOneAndUpdate(
                    { boardId: sanitizedBoardId },
                    { $pull: { cards: sanitizedCardId } },
                    { new: true }
                );
                if (updatedBoard && updatedBoard.cards && updatedBoard.cards.includes(sanitizedCardId) == false) {

                    // Sending Final Response of card deletion update
                    return res.status(200).json({
                        success: true,
                        message: "Card Deleted Successfully"
                    });
                } else {
                    return res.status(424).json({
                        success: false,
                        message: "Card deleted BUT NOT removed from Board"
                    });
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "No card Deleted!"
                });
            }
        } catch (error) {
            console.log('Error while Deleting a Card : ', error)
            return res.status(500).json({
                success: false,
                message: error
            });
        }
    }
    // Logic ends

}
