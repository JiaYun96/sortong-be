const mongoose = require ('mongoose')

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardModel',
        required: true
    },
    
    order: {
        type: String,
        required: true
    }
},

    {timestamps: true}

)
const ListModel = mongoose.model('ListModel', listSchema)

module.exports = {
    ListModel: ListModel
}