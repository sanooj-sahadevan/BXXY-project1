const mongoose= require('mongoose')

const adminSchema= new mongoose.Schema({
    email: String,
    password: String
})

module.exports= mongoose.model('admins', adminSchema)

