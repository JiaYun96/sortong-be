const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({

    boardId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: [true, "Board title is required"]
    },

    userId: {
        type: String,
        required: true,
        ref: 'UserModel'
    },

    img: {
        type: String,
        required: false,
        default: ''
    },

    cards: [{
        type: String,
        required: true,
        ref: "CardModel"
    }]
},
    {
        timestamps: true
    }

);

boardSchema.index({ boardId: 1 }); // creating customized index

const BoardModel = mongoose.model('board', boardSchema)

module.exports = {
    BoardModel: BoardModel
}