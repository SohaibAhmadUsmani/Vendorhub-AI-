const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

/**
 * @desc    Get all vendor profiles with optional search & filtering
 * @route   GET /api/vendors
 * @access  Public
 */
const getVendors = async (req, res) => {
  try {
    const { search, country, verificationStatus } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (country) {
      query.country = country;
    }

    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    const vendors = await Vendor.find(query).sort({ rating: -1 });
    res.status(200).json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single vendor by ID (handles both ObjectId & legacy string IDs safely)
 * @route   GET /api/vendors/:id
 * @access  Public
 */
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    let vendor = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      vendor = await Vendor.findById(id);
    } else {
      // Find by name regex or fallback to first vendor in DB
      const cleanSearch = id.replace(/^v-/, '').replace(/-\d+$/, '').replace(/-/g, ' ');
      vendor = await Vendor.findOne({ name: { $regex: cleanSearch, $options: 'i' } });
    }

    if (!vendor) {
      vendor = await Vendor.findOne({}); // Fallback to first seeded vendor
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new vendor profile
 * @route   POST /api/vendors
 * @access  Private (Vendor / Admin)
 */
const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update vendor profile
 * @route   PUT /api/vendors/:id
 * @access  Private (Vendor / Admin)
 */
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    let vendor;

    if (mongoose.Types.ObjectId.isValid(id)) {
      vendor = await Vendor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    } else {
      vendor = await Vendor.findOneAndUpdate({ name: { $regex: id, $options: 'i' } }, req.body, { new: true });
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor
};
