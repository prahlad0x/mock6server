const express = require('express')
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')


userRouter.post('/register', async(req, res)=>{
    try {
        let {email, password} = req.body;

        let user = await UserModel.findOne({email})
        if(user) return res.status(401).send({msg : "User Already Registered!", isOk : false})

        const token = jwt.sign({email}, 'tokenkey', {expiresIn : '1d'})

        const hash =bcrypt.hashSync(password, 6)

        let newUser = new UserModel({email, password : hash})
        await newUser.save()

        return res.status(201).send({msg : "Registration successful", isOk : true, user : newUser, token : token})

    } catch (error) {
        console.log(error)
        return res.status(401).send({msg : "something went wrong!", error : error, isOk : false})
    }
})


userRouter.post('/login', async (req, res)=>{
    try {

        let {email , password} = req.body;

        let user = await UserModel.findOne({email})
        if(!user) return res.status(404).send({msg : "User Not Found", isOk : false})
        
        let isPassOk =  bcrypt.compareSync(password, user.password)

        if(!isPassOk) return res.status(401).send({msg : "Invalid Credientials!", isOk : false})

        const token = jwt.sign({email}, process.env.tokenkey, {expiresIn : '1d'})

        return res.status(201).send({msg: "Login Successful", isOk : true, user : user, token : token})
    
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg : "something went wrong!", error : error, isOk : false})
    }
})

userRouter.get('/logout', async (req, res)=>{
    res.send({msg : "logout successful"})
})

module.exports = {userRouter}