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
    
    // skills: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "SkillsModel"
    // }],
    // image: String, //cloudinary image URL
    },

    {
    timestamp: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true }
})



const UserModel = mongoose.model('UserModel', userSchema)

module.exports = {
    UserModel: UserModel
}