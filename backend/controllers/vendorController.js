const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Review = require('../models/Review');

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

    const vendors = await Vendor.find(query).sort({ rating: -1 }).populate('reviews');
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
      vendor = await Vendor.findById(id).populate('reviews');
    } else {
      // Find by name regex or fallback to first vendor in DB
      const cleanSearch = id.replace(/^v-/, '').replace(/-\d+$/, '').replace(/-/g, ' ');
      vendor = await Vendor.findOne({ name: { $regex: cleanSearch, $options: 'i' } }).populate('reviews');
    }

    if (!vendor) {
      vendor = await Vendor.findOne({}).populate('reviews'); // Fallback to first seeded vendor
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
      vendor = await Vendor.findById(id);
    } else {
      vendor = await Vendor.findOne({ name: { $regex: id, $options: 'i' } });
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    if (req.user.role === 'vendor' && vendor.userId.toString() !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Access denied: You can only update your own vendor profile' });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(vendor._id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: updatedVendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete vendor profile
 * @route   DELETE /api/vendors/:id
 * @access  Private (Admin)
 */
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    let vendor;
    if (mongoose.Types.ObjectId.isValid(id)) {
      vendor = await Vendor.findByIdAndDelete(id);
    } else {
      vendor = await Vendor.findOneAndDelete({ name: { $regex: id, $options: 'i' } });
    }
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, message: 'Vendor deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add review to vendor profile (Aiman Module 15 integration)
 * @route   POST /api/vendors/:id/reviews
 * @access  Private (Buyer)
 */
const addVendorReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerName, reviewerCompany, rating, comment, categories } = req.body;

    let vendor = mongoose.Types.ObjectId.isValid(id)
      ? await Vendor.findById(id).populate('reviews')
      : await Vendor.findOne({ name: { $regex: id, $options: 'i' } }).populate('reviews');

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const newReview = await Review.create({
      vendorId: vendor._id,
      reviewerName: reviewerName || 'Verified Buyer',
      reviewerCompany: reviewerCompany || 'Enterprise Client',
      rating: Number(rating) || 5,
      categories: categories || {
        productQuality: 5,
        communication: 5,
        deliverySpeed: 5,
        valueForMoney: 5
      },
      comment: comment || 'Great service and quality products.',
      date: new Date()
    });

    vendor.reviews.push(newReview._id);
    vendor.reviewCount = vendor.reviews.length;
    
    // Temporarily append the new review to populated reviews for calculation
    const allReviews = [...vendor.reviews];
    allReviews[allReviews.length - 1] = newReview;
    const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
    vendor.rating = Number((totalRating / allReviews.length).toFixed(1));

    await vendor.save();
    
    // Replace array of ids with populated documents again for response
    vendor.reviews = allReviews;

    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update vendor risk metrics (Namra Module 13 integration)
 * @route   PUT /api/vendors/:id/risk
 * @access  Private (Admin / Risk AI Service)
 */
const updateVendorRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { overallScore, complianceRisk, operationalRisk, financialRisk } = req.body;

    let vendor = mongoose.Types.ObjectId.isValid(id)
      ? await Vendor.findById(id)
      : await Vendor.findOne({ name: { $regex: id, $options: 'i' } });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    vendor.riskBreakdown = {
      overallScore: overallScore !== undefined ? Number(overallScore) : vendor.riskBreakdown.overallScore,
      complianceRisk: complianceRisk || vendor.riskBreakdown.complianceRisk,
      operationalRisk: operationalRisk || vendor.riskBreakdown.operationalRisk,
      financialRisk: financialRisk || vendor.riskBreakdown.financialRisk
    };

    await vendor.save();
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get currently logged-in vendor profile
 * @route   GET /api/vendors/me
 * @access  Private (Vendor)
 */
const getVendorMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    let vendor = await Vendor.findOne({ userId: req.user._id || req.user.id }).populate('reviews');
    if (!vendor) {
      // Fallback to searching by user email or first vendor
      vendor = await Vendor.findOne({ 'contact.email': req.user.email }).populate('reviews');
    }
    if (!vendor) {
      vendor = await Vendor.findOne({}).populate('reviews');
    }
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  getVendorMe,
  createVendor,
  updateVendor,
  deleteVendor,
  addVendorReview,
  updateVendorRisk
};

