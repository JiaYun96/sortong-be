const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { registrationDataValidate, loginDataValidate } = require('../middleware/dataValidator')
const { UserModel } = require('../models/user')
const { v4: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const scrtToken = require('crypto').randomBytes(64).toString('hex')

module.exports = {

    // User Registration
    register: async (req, res) => {
        if (!req.body) return res.status(400).json({
            success: false,
            message: "Input user details"
        })

        // Validate user input
        const validatedUserRegData = registrationDataValidate.validate(req.body)
        if (validatedUserRegData.error) {
            const errMsg = (validatedUserRegData.error && validatedUserRegData.error.details
                && validatedUserRegData.error.details.length
                && validatedUserRegData.error.details[0].message)
                || "Data Validation, FAILED!"
            return res.status(400).json({
                success: false,
                message: errMsg
            })
        }
        const { fullName, email, password, confirmPassword } = validatedUserRegData.value

        // Sanitize User input
        const sanitizedFullName = fullName.trim()
        const sanitizedEmail = email.trim().toLowerCase()
        const sanitizedPwd = password.trim()
        const sanitizedConfirmPwd = confirmPassword.trim()

        // Password match validation
        if (sanitizedPwd !== sanitizedConfirmPwd) {
            return res.status(406).json({ message: 'Password did not match!' })
        }

        // Check for duplicate/existing user
        try {
            const user = await UserModel.findOne({ email: sanitizedEmail })
            if (user) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists - Please Login"
                })
            }
        } catch (error) {
            console.log('Error in verifying duplicate user', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }

        // Generate unique User Id
        let userId = ''
        try {
            userId = uuid()
            userId = userId.trim() // unique user Id sanitization
        } catch (error) {
            console.log('Error in unique user Id', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
        if (userId === '') {
            return res.status(500).json()
        }

        // Generate hashed password
        let hashedPwd = ''
        try {
            hashedPwd = await bcrypt.hash(sanitizedPwd, 10)
            hashedPwd = hashedPwd.trim() // hashed pwd sanitization
        } catch (error) {
            console.log('Error in hasing password', error)
            return res.status(500).json()
        }
        if (hashedPwd === '') {
            return res.status(500).json()
        }

        // Create data for new user registration
        const createUser = {
            userId: userId,
            fullName: sanitizedFullName,
            email: sanitizedEmail,
            pwd: hashedPwd,
        }

        try {
            const createdUser = await UserModel.create(createUser)
            if (createdUser && createdUser._id && createdUser.userId) {

                // Create token
                const token = jwt.sign({
                    userId: createdUser.userId,
                    email: createdUser.email
                },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: "2h"
                    });
                
                    // save user token
                    createdUser.token = token

                return res.json({
                    success: true,
                    userId: createdUser.userId,
                    // token: createdUser.token,
                    message: "User Registration Successful!"
                })

            } else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create a new user!"
                })
            }
        } catch (error) {
            console.log('Error in creating new user : ', error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    // User Registration (END) =================================================>



    // User Login
    login: async (req, res) => {

        if (!req.body) return res.status(400).json({
            success: false,
            message: "Input login details"
        })

        //validation email & pw provided
        const validatedUserLoginData = loginDataValidate.validate(req.body)
        if (validatedUserLoginData.error) {
            const errMsg = (validatedUserLoginData.error && validatedUserLoginData.error.details
                && validatedUserLoginData.error.details.length
                && validatedUserLoginData.error.details[0].message)
                || "User data validation failed for login"
            return res.status(400).json({
                success: false,
                message: errMsg
            })
        }

        const { email, password } = validatedUserLoginData.value

        // Sanitize User input
        const sanitizedEmail = email.trim().toLowerCase()
        const sanitizedPwd = password.trim()

        //verify user email exists
        let user = null
        try {
            user = await UserModel.findOne({ email: sanitizedEmail })
        } catch (err) {
            return res.status(500).json(err)
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect Email!' })
        }
        const { userId, pwd } = user

        //verify correct password
        let isPasswordCorrect = false
        try {
            isPasswordCorrect = await bcrypt.compare(sanitizedPwd, pwd)
        } catch (err) {
            return res.status(500).json(err)
        }
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Incorrect Password!' })
        }

        if (userId && pwd) {
            const token = jwt.sign({
                userId: userId,
                email: sanitizedEmail
            },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "1h" // Token expiration time
                });
            return res.status(200).json({
                success: true,
                userId: userId,
                message: "Login Successful",
                token: token
            })
        }

    }
    // User Login (END) =================================================>

}