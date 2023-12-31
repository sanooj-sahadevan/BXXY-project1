const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const userRoutes = require("./Routes/userRoutes.js");
const adminRoutes = require("./Routes/adminRoutes.js");
const morgan= require('morgan')
require("dotenv").config();

const port = process.env.PORT || 3000;

const { connectToMongoDB } = require("./config/mongooseConnect.js");
connectToMongoDB();

app.use(morgan('dev'))

const nocache = require("nocache");
app.use(nocache());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "my secret",
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(adminRoutes);

app.listen(port, () => {
  console.log("listening to server on http://localhost:3000");
});
