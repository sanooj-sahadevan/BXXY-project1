const isLogin = async (req, res, next) => {
    try {
        if (req.session.adminId) {

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
        if (req.session.admin_id) {
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