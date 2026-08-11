const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const {
  getVendors,
  getVendorById,
  getVendorMe,
  createVendor,
  updateVendor,
  deleteVendor,
  addVendorReview,
  updateVendorRisk
} = require('../controllers/vendorController');

router.route('/')
  .get(getVendors)
  .post(authMiddleware, roleMiddleware('vendor', 'admin'), createVendor);

router.route('/me')
  .get(authMiddleware, getVendorMe);

router.route('/:id')
  .get(getVendorById)
  .put(authMiddleware, roleMiddleware('vendor', 'admin'), updateVendor)
  .delete(authMiddleware, roleMiddleware('admin'), deleteVendor);

router.route('/:id/reviews')
  .post(addVendorReview);

router.route('/:id/risk')
  .put(authMiddleware, roleMiddleware('admin'), updateVendorRisk);

module.exports = router;


