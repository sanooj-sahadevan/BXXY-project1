const express = require("express")
const app = express()
const path = require('path')
const userRoutes = require("./Routes/userRoutes.js")



const connectToMongoDB = require('./config/mongooseConnect.js')
// connectToMongoDB()

app.set('views',path.join(__dirname,'views'))
app.set('view engine',"ejs");
app.use(express.static(path.join(__dirname, "public"))); 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(userRoutes)


app.listen(9000, () => {
    console.log("server running");
  })