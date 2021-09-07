const mongoose = require('mongoose')
const { Schema } = mongoose

const boardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    
    timestamps: true
})

module.exports = mongoose.model('board', boardSchema)