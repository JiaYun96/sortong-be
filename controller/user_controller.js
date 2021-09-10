const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { UserModel } = require('../models/user')

module.exports = {
    register: async (req, res) => {
        
        //validation user_validate.js
        console.log(req.body)
        const userRegister = req.body

        //password match validation
        if(userRegister.password !== userRegister.confirmPassword) {
            return res.status(406).json({ message: 'Password did not match!' })
        }

        //generate hash
        let hash = ''

        try {
            hash = await bcrypt.hash(userRegister.password, 10)
        } catch (error) {
            console.log(error);
            return res.status(500).json()
        }
        if (hash === '') {
            return res.status(500).json()
        }

        //verify duplicate user
        let user = null
        try {
            user = await UserModel.findOne({ email: userRegister.email })
        } catch (error) {
            console.log(error);
            return res.status(500).json()
        }
        if (user) {
            return res.status(409).json({ message: "Email already exists." })
        }

        //create user account
        let createUser = {
            name: userRegister.name,
            email: userRegister.email,
            hash: hash,
            // age: "",
            // gender: "",
        }

        UserModel.create(createUser)
         .then (response => {
             return res.json(response._id)
         })
         .catch (err => {
             return res.status(500).json(err)
         })
    },


    login: async (req, res) => {

        //validation email & pw provided
        const validatedResult = loginValidate.validate(req.body)
        if(validatedResult.error) {
            return res.status(400).json({ message: validatedResult.error })
        }

        const validatedValue = validatedResult.value

        //verify user email exists
        let user = null
        try {
            user = await UserModel.findOne({email: validatedValue.email})
        } catch (err) {
            return res.status(500).json(err)
        }
        if (!user) {
            return res.status(200).json({ success: false, message: 'Given email is incorrect' })
        }
        //verify correct password
        let isPasswordCorrect = false
        try {
            isPasswordCorrect = await bcrypt.compare(validatedValue.password, user.hash)
        } catch(err) {
            return res.status(500).json(err)
        }
        if (!isPasswordCorrect) {
            return res.status(200).json({ success: false, message: 'Given password is incorrect' })
        }

        return res.json({ success: true, userID: user._id, message: "Login Successfully!", name: user.name })

        //JWT expiry

    },
}