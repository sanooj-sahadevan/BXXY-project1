const express = require("express")
const app = express()
const path = require('path')
const session = require("express-session"); 
const userRoutes = require("./Routes/userRoutes.js")
const adminRoutes = require('./Routes/adminRoutes.js');

const port = process.env.PORT || 3000;



const {connectToMongoDB} = require('./config/mongooseConnect.js');
connectToMongoDB()




app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:true,
  }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.set('views',path.join(__dirname,'views'))
app.set('view engine',"ejs");
app.use(express.static(path.join(__dirname, "public"))); 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(userRoutes)
app.use(adminRoutes)





app.listen(port, () => { console.log('listening to server on http://localhost:3000') })
