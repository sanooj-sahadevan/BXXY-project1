const adminCollection = require("../models/Model");




const adminLogin = async (req,res)=>{
    console.log('111');
    res.render('adminViews/login.ejs')
}

// const validateAdmin = async (req, res) => {
//     console.log('11');

//     const { email, password } = req.body
//     const admin = await adminCollection.findOne({ email })

//     if (admin) {
//         if (password == admin.password) {
//             console.log('poooi');
//             // req.session.admin = {
//             //     name: admin.name
//             // }
//             console.log(req.session.admin);
//             res.render('adminViews/dashboard.ejs')
//         } else {
//             res.render('adminLogin', { err: 'incorrect password' })
//         }
//     } else {console.log('poi');
//         res.render('adminViews/login', { error: 'please enter all fields' })
//     }

// }

const validateAdmin = async (req, res) => {
    console.log('1');
    const existingAdmin = await adminCollection.findOne({ email: req.body.email })

    if (existingAdmin && existingAdmin.email === req.body.email && existingAdmin.password === req.body.password) {
        console.log('2');
       
        res.redirect('/adminHome')
        req.session.admin = true
    } else {
        req.session.adminInvalidCredentials = true
        res.redirect('/adminLogin') // Redirect to adminLogin for invalid credentials
    }
}

const adminHome = (req, res) => {
    if (req.session.admin) {
        console.log('222');
        res.render('adminViews/dashboard.ejs')
    } else {
        res.render('adminViews/login.ejs')
    }
}


const productlist = async (req, res) => {
    try {
      const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
      const totalProducts = await product.countDocuments(); // Count the total number of products
  
      const products = await product
        .find()
        .skip((currentPage - 1) * productsPerPage)
        .limit(productsPerPage)
        .exec();
  
      const totalPages = Math.ceil(totalProducts / productsPerPage); // Calculate the total number of pages
  
      res.render('products', {
        model: '1',
        product: products,
        user: req.session.user_id,
        currentPage: currentPage,
        totalPages: totalPages
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  






module.exports = {
    adminHome,adminLogin,validateAdmin,productlist
    

}