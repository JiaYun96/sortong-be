const mongoose = require('mongoose')
// const statusCodes = ;

const cardSchema = new mongoose.Schema({

    cardId: {
        type: String,
        required: true,
        unique: true
    },

    cardTitle: {
        type: String,
        required: true
    },

    cardDescription: {
        type: String,
        required: true
    },

    cardStatus: {
        type: Number,
        required: true,
        default: 1
    },

    cardIndex: {
        type: Number,
        required: false,
        default: 0
    },

    boardId: {
        type: String,
        required: true,
        ref: "BoardModel",
    }

},
    {
        timestamps: true
    }

);

cardSchema.index({ cardId: 1 }); // creating customized index

const CardModel = mongoose.model('card', cardSchema)

module.exports = {
    CardModel: CardModel
}