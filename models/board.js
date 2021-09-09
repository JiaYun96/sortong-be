const mongoose = require ('mongoose')

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Board name is required"]
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },

    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CardModel"
    }],
},

    {timestamps: true}

)

const BoardModel = mongoose.model('BoardModel', boardSchema)

module.exports = {
    BoardModel: BoardModel
}