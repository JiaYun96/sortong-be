const mongoose = require ('mongoose')

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    }
},

    {timestamps: true}

)

const BoardModel = mongoose.model('BoardModel', boardSchema)

module.exports = {
    BoardModel: BoardModel
}