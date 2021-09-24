const joi = require('joi')

module.exports = {

    registrationDataValidate: joi.object({
        fullName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required()
    }),

    loginDataValidate: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    }),

    createBoardDataValidate: joi.object({
        boardId: joi.string().required(),
        userId: joi.string().required(),
        title: joi.string().required()
    }),

    createCardDataValidate: joi.object({
        boardId: joi.string().required(),
        cardId: joi.string().required(),
        title: joi.string().required(),
        desc: joi.string().required()
    }),

    updateCardDataValidate: joi.object({
        boardId: joi.string().required(),
        cardId: joi.string().required(),
        title: joi.string().allow(''),
        desc: joi.string().allow(''),
        status: joi.number().valid(1, 2, 3),
        index: joi.number().min(1)
    }).or('title', 'desc', 'status', 'index')

}
