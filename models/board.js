const mongoose = require ('mongoose')

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Board title is required"]
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },

    col1: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CardModel"
    }],

    col2: [],
    col3: [],
})

const BoardModel = mongoose.model('BoardModel', boardSchema)

module.exports = {
    BoardModel: BoardModel
}