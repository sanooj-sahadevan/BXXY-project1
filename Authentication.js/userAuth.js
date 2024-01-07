const isLogout = async (req, res, next) => {
  console.log('authin');
    req.session.destroy();
    res.redirect("/");
    console.log("logout");
  };
  
  
  const isLogin = async (req, res, next) => {
    console.log('authout');
    try {
      if (req.session.user) {
        res.redirect("userViews/landingpage");
      } else {
        next();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  module.exports = { isLogin, isLogout };
  