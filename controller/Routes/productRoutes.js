const express = require('express');
const multer = require('multer');
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../productControllers');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addProduct', upload.single('image'), addProduct);
router.get('/products', getProducts);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
