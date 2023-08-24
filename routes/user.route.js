const express = require('express')
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')
require('dotenv').config()

userRouter.post('/register', async(req, res)=>{
    try {
        let {email, password, username, avatar} = req.body;

        if(!avatar || avatar == ""){
            avatar = 'https://randomuser.me/api/portraits/men/61.jpg'
        }

        let user = await UserModel.findOne({email})
        if(user) return res.status(401).send({msg : "User Already Registered!", isOk : false})

        const hash =bcrypt.hashSync(password, +process.env.salt)

        let newUser = new UserModel({username, avatar,email, password : hash})
        await newUser.save()

        return res.status(201).send({msg : "Registration successful", isOk : true, user : newUser})

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

        const token = jwt.sign({email : email}, process.env.tokenkey, {expiresIn : '1d'})

        return res.status(201).send({msg: "Login Successful", isOk : true, user : user, token : token})
    
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg : "something went wrong!", error : error, isOk : false})
    }
})


module.exports = {userRouter}