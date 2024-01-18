module.exports = async (req, res, next) => {
    try {
      if (req.body.user) {
        next();
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
    }
  };