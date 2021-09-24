const mongoose = require ('mongoose')

const listSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true, 
        unique: true
    },

    boards: [{
        type: String,
        required: true,
        ref: "BoardModel"
    }],

})

const UserModel = mongoose.model('list', listSchema)

module.exports = {
    ListModel: ListModel
}