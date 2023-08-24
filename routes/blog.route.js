const express = require('express')
const jwt = require('jsonwebtoken')
const { Blog } = require('../models/blog.model')
const blogRouter = express.Router()
require('dotenv').config()

blogRouter.get('/', async(req,res)=>{
    try {
        let query = {}
        let {sort, order, category, title} = req.query
        let sortorder = false
        if(category){
            query['category'] = category
        }
        if(title){
            query['title'] = { $regex: new RegExp(title, 'i') }
        }
        if(sort && order && order != ''){
            sortorder = (order == 'asc')? 1 : -1
        }

        if(sortorder == 1 || sortorder == -1){
            let blogs = await Blog.find(query).sort({'date' : sortorder})
            return res.status(200).send({msg : "all blogs", isOk : true, blogs : blogs})
        }
        else{
            let blogs = await Blog.find(query)
            return res.status(200).send({msg : "all blogs", isOk : true, blogs : blogs})
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg :"Something went wrong !", isOk : false, error : error})
    }
})


blogRouter.post('/', async(req,res)=>{
    const token = req.headers?.authorization
    try {
        let decoded = jwt.verify(token, process.env.tokenkey)
        let blog = new Blog({...req.body, userEmail : decoded.email, date : Date.now()})
        await blog.save()
        return res.status(202).send({msg : "blog added successfully", isOk : true, blog : blog})
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg :"Something went wrong !", isOk : false, error : error})
    }
})


blogRouter.get('/:id',async(req,res)=>{
    try {
        let blog = await Blog.findById(id)
        return res.status(200).send({msg : 'blog', isOk : true, blog : blog})
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg :"Something went wrong !", isOk : false, error : error})
    }
})

blogRouter.patch('/:id', async(req,res)=>{
    try {
        
        let blog = await Blog.findByIdAndUpdate(req.params.id, req.body)
        return res.status(202).send({msg : "blog updated successfully", isOk : true, blog : blog})
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg :"Something went wrong !", isOk : false, error : error})
    }
})




blogRouter.delete('/:id',async(req,res)=>{
    try {
        await Blog.findByIdAndDelete(req.params.id)
        return res.status(201).send({msg : "blog deleted successfully", isOk : true})
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg :"Something went wrong !", isOk : false, error : error})
    }
})


module.exports = {blogRouter}