const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    username : {type :String, required : true},
    title : {type :String, required : true},
    content : {type :String, required : true},
    category : {type :String, required : true},
    date : {type :Date, required : true},
    likes : {type : Number, required :true},
    userEmail : {type:String, required : true},
    comments : [{
        username : {type : String, required : true},
        content : {type : String, required : true}
    }]
})


const Blog = mongoose.model('blog', blogSchema)

module.exports = {Blog}