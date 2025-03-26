const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const app = express()
const mongoose = require("mongoose")
require('dotenv').config()


app.use(express.static('public'))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect(process.env.MONGO_URI)

const blogSchema = mongoose.Schema({title:String, desc:String})
const Blog = mongoose.model("blog",blogSchema)

let title_data = {
    home: "Home page",
    compose: "Compose page",
    about: "About page",
    contact: "Contact",
    post: "Post page"
}

app.get("/",async function(req,res){
    try{
        let blogs = await Blog.find({})
        res.render("home",{title:title_data.home,blogs:blogs})
    }catch(err){
        console.log("Error with listing blogs")
    }
})

app.get("/compose",function(req,res){
    res.render("compose",{title:title_data.compose})
})

app.get("/contact",function(req,res){
    res.render("contact",{title:title_data.contact})
})

app.get("/about",function(req,res){
    res.render("about",{title:title_data.about})
})

app.post("/post",async function(req,res){
    console.log(req.body)
    let find = req.body.submit
    try{
        let blog = await Blog.findOne({_id:find})
        res.render("posts",{title:title_data.post,blog: blog})
    }catch{
        console.log("Error in finding the blog")
    }
}) 

app.post("/compose",async function(req,res){
    try{
        const b = new Blog({title:req.body.title, desc:req.body.blog_desc})
        await b.save()
        res.redirect("/")
    }catch{
        console.log("error in composing")
    }
    
})

app.post("/delete",async function(req,res){
    let find = req.body.id
    try{
        await Blog.findByIdAndDelete(find)
        console.log("blog deleted")
        res.redirect("/")
    }catch{
        console.log("Error in deleting the blog")
    }
    
})

app.listen(3000,function(){
    console.log("running")
})