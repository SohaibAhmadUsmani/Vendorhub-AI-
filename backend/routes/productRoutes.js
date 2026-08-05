const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductsByVendor,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/categories')
  .get(getCategories);

router.route('/vendor/:vendorId')
  .get(getProductsByVendor);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;

