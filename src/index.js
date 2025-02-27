const express=require('express')
const app=express()


// Middleware to parse JSON request bodies
app.use(express.json())
app.use(express.urlencoded({ extended:true}))

module.exports = app