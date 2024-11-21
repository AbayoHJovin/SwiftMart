const express = require('express');
const multer = require('multer');
require("dotenv").config()
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  makeAPopularProduct,
  getpopularProducts
} = require('../productControllers');


const router = express.Router();


const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME , // Replace with your Cloudinary cloud name
  api_key:process.env.CLOUD_API_KEY , // Replace with your Cloudinary API key
  api_secret:process.env.CLOUD_SECRET_KEY, // Replace with your Cloudinary API secret
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/addProduct', upload.single('image'), addProduct); 
router.get('/products', getProducts); 
router.put('/products/:id', upload.single('image'), updateProduct); 
router.delete('/products/:id', deleteProduct); 
router.patch("/makeAPopularProduct", makeAPopularProduct); 
router.get("/getPopularProducts", getpopularProducts); 

module.exports = router;
