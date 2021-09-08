const mongoose = require ('mongoose')

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardModel',
        required: true
    },

    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListModel',
        required: true
    },

    order: {
        type: String,
        required: true
    }
},

    {timestamps: true}

)

const CardModel = mongoose.model('CardModel', cardSchema)

module.exports = {
    CardModel: CardModel
}