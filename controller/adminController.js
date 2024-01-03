const adminCollection = require("../models/Model");
const productCollection = require('../models/productModel.js')





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
    if (req.session.admin = true) {
        console.log('222');
        res.render('adminViews/dashboard.ejs')
    } else {
        res.render('adminViews/login.ejs')
    }
}


const productlist = async (req, res) => {
  res.render('adminViews/productlist.ejs')
}
  //   try {
  //     const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
  //     const totalProducts = await product.countDocuments(); // Count the total number of products
  
  //     const products = await product
  //       .find()
  //       .skip((currentPage - 1) * productsPerPage)
  //       .limit(productsPerPage)
  //       .exec();
  
  //     const totalPages = Math.ceil(totalProducts / productsPerPage); // Calculate the total number of pages
  
  //     res.render('adminViews/productlist.ejs', {
  //       model: '1',
  //       product: products,
  //       user: req.session.user_id,
  //       currentPage: currentPage,
  //       totalPages: totalPages
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  
  
  const editAdminPage =  async(req,res)=>{
    res.render('adminViews/editPage')
  }

  const addProductPage =  async(req,res)=>{
    res.render('adminViews/addproduct')

  }

  // const add_product = async (req, res) => {
  //   console.log('0');
  //   try {
  //       const { productname, category, quantity, price, brand, description, mrp } = req.body;

  //       // Check if required fields are missing
  //       if (!productname || !category || !quantity || !price || !brand || !description || !mrp) { console.log('a');
  //           const fieldRequired = 'All Fields Are Required';
  //           const categories = await categoryModel.find().lean();
  //           return res.render('adminViews/addproduct.ejs', { fieldRequired, categories });
  //       }

  //       // Check if files are present in the request
  //       if (!req.files || !req.files.images || req.files.images.length === 0) { console.log('b');
  //           const noImagesError = 'At least one image is required';
  //           const categories = await categoryModel.find().lean();
  //           return res.render('adminViews/addproduct.ejs', { noImagesError, categories });
  //       }

        // Image Processing
        // const processedImages = await Promise.all(
        //     req.files.images.map(async (image) => {
        //         await sharp(image.path)
        //             .png()
        //             .resize(600, 600, {
        //                 kernel: sharp.kernel.nearest,
        //                 fit: 'contain',
        //                 position: 'center',
        //                 background: { r: 255, g: 255, b: 255, alpha: 0 }
        //             })
        //             .toFile(image.path + ".png");

        //         image.filename = image.filename + ".png";
        //         image.path = image.path + ".png";

        //         return image.filename;
        //     })
        // );

        // Create Product Object
        // const product = new productModel({
        //     productname,
        //     category,
        //     quantity,
        //     price,
        //     brand,
        //     description,
        //     mrp,
        //     mainImage
        // });

//         console.log(product);

//         // Save Product to Database
//         await product.save();
//         console.log('Product saved successfully');

//         // Send a success response
//         return res.redirect('/productMngt');

//     } catch (error) {
//         // Handle the error
//         console.error(error.message);
//         return res.status(500).send({ error: 'Internal Server Error' });
//     }
// };


const addProduct = async (req, res) => { console.log('kk');
  try {
    let existingProduct = await productCollection.findOne({
      productName: req.body.productName,
    });
    if (!existingProduct) { console.log('in');
      await productCollection.insertMany([
        {
          productName: req.body.productName,
          // parentCategory: req.body.parentCategory,
          productImage1: req.files[0].filename,
          productImage2: req.files[1].filename,
          productImage3: req.files[2].filename,
          productPrice: req.body.productPrice,
          productStock: req.body.productStock,
        },
      ]);
      // console.log(req.files[0].filename);
      res.redirect("/addproduct");
    } else {console.log('out');
      req.session.productAlreadyExists = existingProduct;
      res.redirect("/addproduct");
    }
  } catch (err) {
    console.log(err);
  }
}

const editProduct = (req,res)=>{
  res.render('')

}



module.exports = {
    adminHome,adminLogin,validateAdmin,productlist,editAdminPage,addProductPage,addProduct,editProduct

}