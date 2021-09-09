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

    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoardModel",
        required: true
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