const mongoose = require ('mongoose')

const cardSchema = new mongoose.Schema({
    cardTitle: {
        type: String,
        required: true
    },

    cardDescription: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    boardID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoardModel",
    },

    // order: {
    //     type: String,
    //     required: true
    // }

},

    {timestamps: true}

)

const CardModel = mongoose.model('CardModel', cardSchema)

module.exports = {
    CardModel: CardModel
}