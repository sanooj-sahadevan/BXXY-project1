const userCollection = require("../models/userModels.js");
/**
 * 
 *  
 *  
 */
blockuser = async (req, res, next) => {
  try {
    let currentUser = await userCollection.findOne({
      _id: req.session?.currentUser?._id,
    });
    if ( currentUser?.block) {
      req.session.destroy();
      res.redirect(req.originalUrl)
    } else {
        console.log('next');
      next();
    }
  } catch (error) {
    console.error(error)
  }
}
  module.exports = blockuser;
