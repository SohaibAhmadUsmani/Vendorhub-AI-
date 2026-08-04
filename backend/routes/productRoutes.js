const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductsByVendor,
  getProductById,
  createProduct
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/vendor/:vendorId')
  .get(getProductsByVendor);

router.route('/:id')
  .get(getProductById);

module.exports = router;
