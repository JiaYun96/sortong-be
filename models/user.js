const mongoose = require ('mongoose')
// const { EnumUserGender } = require('./choices')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    
    hash: {
        type: String, 
        required: true
    },

    board: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BoardModel"
    }],

})



const UserModel = mongoose.model('UserModel', userSchema)

module.exports = {
    UserModel: UserModel
}