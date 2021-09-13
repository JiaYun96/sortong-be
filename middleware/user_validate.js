const joi = require('joi')

module.exports = {

    loginValidate: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    }),

}
