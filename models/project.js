const mongoose = require('mongoose')
const { Schema } = mongoose

const projectSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
},
{
    
    timestamps: true
})

module.exports = mongoose.model('project', projectSchema)