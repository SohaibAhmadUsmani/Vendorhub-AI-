const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  addVendorReview,
  updateVendorRisk
} = require('../controllers/vendorController');

router.route('/')
  .get(getVendors)
  .post(createVendor);

router.route('/:id')
  .get(getVendorById)
  .put(updateVendor)
  .delete(deleteVendor);

router.route('/:id/reviews')
  .post(addVendorReview);

router.route('/:id/risk')
  .put(updateVendorRisk);

module.exports = router;

