const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
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
  .post(authMiddleware, roleMiddleware('vendor', 'admin'), createProduct);

router.route('/categories')
  .get(getCategories);

router.route('/vendor/:vendorId')
  .get(getProductsByVendor);

router.route('/:id')
  .get(getProductById)
  .put(authMiddleware, roleMiddleware('vendor', 'admin'), updateProduct)
  .delete(authMiddleware, roleMiddleware('vendor', 'admin'), deleteProduct);

module.exports = router;


