const mongoose = require('mongoose') // Usually for validation of mongo objectID
const { BoardModel } = require('../models/board')
const { CardModel } = require('../models/card')
const { UserModel } = require('../models/user')
const { v4: uuid } = require('uuid');
const { createBoardDataValidate } = require('../middleware/dataValidator')

module.exports = {

    // Find and show all EXISTING boards for an User
    findAllBoards: async (req, res) => {
        try {
            const { userId } = req.params;

            // Data sanitization
            const sanitizedUserId = userId.trim()

            // Data validation
            if (!sanitizedUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'Required values are not completed to fetch all boards of the user',
                })
            }

            // Getting all boards for a user
            const userBoards = await BoardModel.find({ userId: sanitizedUserId });
            if (userBoards) {

                // Sending final data to frontend side
                return res.status(200).json({
                    success: true,
                    data: userBoards.length ? userBoards : []
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Unable to find boards" //
                })
            }
        } catch (error) {
            console.log('Error while fetching all Boards for the user : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    /* ======= Logic ends for 'Showing all existing boards of an User' ====== */ 




    // Find and a single EXISTING boards for an User
    findByBoardId: async (req, res) => {
        try {
            const { userId, boardId } = req.params;

            // Data sanitization
            const sanitizedUserId = userId.trim()
            const sanitizedBoardId = boardId.trim()

            // Data validation
            if (!sanitizedUserId || !sanitizedBoardId) {
                return res.status(400).json({
                    success: false,
                    message: 'Required values are not completed to fetch all boards of the user',
                })
            }

            const userBoard = await BoardModel.findOne({ boardId: sanitizedBoardId })
            if (userBoard && userBoard.userId == sanitizedUserId) {

                // Sending final data to frontend side
                return res.status(200).json({
                    success: true,
                    data: userBoard
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "unable to find the Board"
                })
            }
        } catch (error) {
            console.log('Error while fetching a Board, for the user : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    /* ======= Logic ends for 'Find and a single EXISTING boards for an User' ====== */ 




    // Create new board for user
    createBoard: async (req, res) => {
        try {
            const { title } = req.body;
            const { userId } = req.params;
            const boardId = uuid(); // unique board Id

            // Data sanitization
            const dataForValidation = {
                boardId: boardId.trim(),
                userId: userId.trim(),
                title: title.trim()
            }

            // Data Validation
            const { error, value } = createBoardDataValidate.validate(dataForValidation)
            if (error) {
                const errMsg = (error && error.details && error.details.length && error.details[0].message) || "Data Validation, FAILED!";
                return res.status(400).json({
                    success: false,
                    message: errMsg
                });
            }

            // Creating Data for adding an new Board
            const board = {
                userId: value.userId,
                boardId: value.boardId,
                title: value.title
            }

            // Creating a new board
            const newBoard = await BoardModel.create(board);

            if (newBoard && newBoard._id) {
                // Updated the user with newly created board
                const updatedUser = await UserModel.findOneAndUpdate(
                    { userId: userId },
                    { $push: { boards: newBoard.boardId } }
                )

                // If success then, sending final success response
                if (updatedUser) {
                    return res.status(200).json({
                        success: true,
                        data: newBoard
                    });
                } else {
                    return res.status(424).json({
                        success: false,
                        message: 'Failed to add the newly created Board, to the User'
                    })
                }
            } else {
                return res.status(422).json({
                    success: false,
                    message: 'Failed to create a Board'
                })
            }
        } catch (error) {
            console.log('Error while Creating a NEW Board, for the user : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }

    },
    /* ======= Logic ends for 'Create new board for User' ====== */ 




    // Update an existing board
    updateBoard: async (req, res) => {

        try {
            const { title } = req.body;
            const { userId, boardId } = req.params;

            // Data sanitization
            const sanitizedTitle = title.trim()
            const sanitizedBoardId = boardId.trim()

            // Data validation
            if (!title || !userId || !boardId) {
                return res.status(400).json({
                    success: false,
                    message: 'Provide required values to update an Existing Board'
                })
            }


            // Updating an existing Board
            const updatedBoard = await BoardModel.updateOne(
                { boardId: sanitizedBoardId },
                {
                    $set: { title: sanitizedTitle }
                },
                { returnNewDocument: true, omitUndefined: true }
            )

            if (updatedBoard) {

                // Sending Success Response to the frontend side
                if (updatedBoard.nModified && updatedBoard.nModified === 1) {
                    return res.status(200).json({
                        success: true,
                        message: "Board Details Updated!"
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "No NEW Data, to Update!"
                    });
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Failed To Update the Board"
                });
            }
        }
        catch (error) {
            console.log('Error while Updating a Board : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    /* ======= Logic ends for 'Update an existing board' ====== */ 




    // Delete an existisg board
    deleteBoard: async (req, res) => {
        try {

            const { userId, boardId } = req.params;

            // Data sanitization
            const sanitizedUserId = userId.trim()
            const sanitizedBoardId = boardId.trim()

            // Data validation
            if (!sanitizedUserId || !sanitizedBoardId) {
                return res.status(400).json({
                    success: false,
                    message: 'Provide required values to Delete a board.'
                })
            }

            let statusCode = 200;
            let success = true;
            let message = "";

            // Check if the board(to be deleted) exists
            const boardToBeDeleted = await BoardModel.findOne({ boardId: sanitizedBoardId });
            if (boardToBeDeleted && boardToBeDeleted.boardId && boardToBeDeleted.boardId == sanitizedBoardId) {

                // Delete all the cards of the board(to be deleted)
                const currentBoardDeletedCards = await CardModel.deleteMany({ boardId: boardToBeDeleted.boardId })
                if (currentBoardDeletedCards) {
                    message = "Only, All cards deleted for this board"

                    // Delete the board itself
                    const deletedBoard = await BoardModel.deleteOne({ boardId: sanitizedBoardId })
                    if (deletedBoard) {
                        message = "Only, Cards & Board itself Get Deleted"

                        // Delete the board from User Boards Array
                        const updatedUser = await UserModel.findOneAndUpdate({ userId: sanitizedUserId }, { $pull: { boards: sanitizedBoardId } });
                        if (updatedUser && updatedUser.userId && updatedUser.userId == sanitizedUserId) {

                            // Creating final success message for board deletion
                            message = "Board Deleted successfully"
                        } else {
                            statusCode = 404;
                            success = false;
                            message = "Boards deleted but not removed from user details"
                        }
                    } else {
                        statusCode = 404;
                        success = false;
                        message = "Cards deleted but Boards Not deleted & not removed from user details"
                    }
                } else {
                    statusCode = 404;
                    success = false;
                    message = "Unable to Delete Board!"
                }
            } else {
                statusCode = 404;
                success = false;
                message = "No Board Found, to be Deleted!";
            }

            // Sending Final Response of board deletion update
            return res.status(statusCode).json({
                success: success,
                message: message
            });
        } catch (error) {
            console.log('Error while Deleting a Board : ', error)
            return res.status(500).json({
                success: false,
                message: error
            });
        }
    }
    /* ======= Logic ends for 'Delete an existing board' ====== */ 


}
