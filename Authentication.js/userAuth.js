const isLogout = async (req, res, next) => {
  console.log('logout');
  req.session.user = null,
    req.session.currentuser = null

  console.log("logout");
  next()
};


const isLogin = async (req, res, next) => {
  console.log('auth in');
  try {
    if (req.session.user) {
      res.redirect("/");r
    } else if (req.session.admin) {
      res.redirect('/adminHome')

    } else {
      next()
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { isLogin, isLogout };
