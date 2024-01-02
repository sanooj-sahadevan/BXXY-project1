const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin) {

        } else {
            res.redirect('/adminLogin');
        }
        next();
    }
    catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin) {
            res.redirect('/adminDashboard');
        } else {

        }
        next();
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = { isLogin, isLogout }