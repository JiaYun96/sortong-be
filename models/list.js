const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true, 
        unique: true
    },

    fullName: {
        type: String, 
        required: true
    },
    
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    
    pwd: {
        type: String, 
        required: true
    },

    boards: [{
        type: String,
        required: true,
        ref: "BoardModel"
    }],

})


userSchema.index({ userId: 1 }); // creating customized index

const UserModel = mongoose.model('user', userSchema)

module.exports = {
    UserModel: UserModel
}