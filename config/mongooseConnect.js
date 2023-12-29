const mongoose = require('mongoose');
require('dotenv').config()  //env
const {mongooseConnectionId,mongoosePassword} = process.env;

const password = encodeURIComponent(mongoosePassword); //password URLencoding
const connection = `mongodb+srv://sanoojsahadevan:${password}${mongooseConnectionId}`;

const connectToMongoDB = async () => {
      await mongoose.connect(connection,{
      useNewUrlParser:true,
      useUnifiedTopology:true
  
}).then(()=>{
      console.log(`Connected to MongoDB Atlas`);
}).catch((error)=>{
      console.log(error.message);
      console.log("Not Connected");
})

};

module.exports = { connectToMongoDB };
