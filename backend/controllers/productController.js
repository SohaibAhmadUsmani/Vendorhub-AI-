const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * @desc    Get all product catalog items with server-side filtering, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      inStock, 
      minPrice, 
      maxPrice, 
      maxMoq, 
      maxLeadTime, 
      sort, 
      page = 1, 
      limit = 20, 
      vendorId 
    } = req.query;

    let query = {};

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      query.vendorId = vendorId;
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (maxMoq) {
      query.moq = { $lte: Number(maxMoq) };
    }

    if (maxLeadTime) {
      query.leadTimeDays = { $lte: Number(maxLeadTime) };
    }

    // Sort order mapping
    let sortOptions = { rating: -1, createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'rating-desc') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;


    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('vendorId', 'name logo logoImage location verificationStatus');

    res.status(200).json({ 
      success: true, 
      count: products.length, 
      total, 
      page: pageNum, 
      pages: Math.ceil(total / limitNum) || 1, 
      data: products 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get products by Vendor ID
 * @route   GET /api/products/vendor/:vendorId
 * @access  Public
 */
const getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    let query = {};
    if (mongoose.Types.ObjectId.isValid(vendorId)) {
      query.vendorId = vendorId;
    }
    const products = await Product.find(query).sort({ rating: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate('vendorId');
    } else {
      product = await Product.findOne({ name: { $regex: id, $options: 'i' } });
    }
    if (!product) {
      product = await Product.findOne({});
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new catalog product
 * @route   POST /api/products
 * @access  Private (Vendor / Admin)
 */
const createProduct = async (req, res) => {
  try {
    const body = req.body;
    if (body.title && !body.name) body.name = body.title;
    if (body.priceMin && !body.price) body.price = Number(body.priceMin);
    if (body.imageUrl && !body.image) body.image = body.imageUrl;
    if (body.availableStock && !body.stockQuantity) body.stockQuantity = Number(body.availableStock);
    
    const product = await Product.create(body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update existing catalog product
 * @route   PUT /api/products/:id
 * @access  Private (Vendor / Admin)
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (body.title && !body.name) body.name = body.title;
    if (body.priceMin && !body.price) body.price = Number(body.priceMin);
    if (body.imageUrl && !body.image) body.image = body.imageUrl;
    if (body.availableStock && !body.stockQuantity) body.stockQuantity = Number(body.availableStock);

    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    } else {
      product = await Product.findOneAndUpdate({ name: { $regex: id, $options: 'i' } }, body, { new: true });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete catalog product
 * @route   DELETE /api/products/:id
 * @access  Private (Vendor / Admin)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ name: { $regex: id, $options: 'i' } });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get product category list with aggregated item counts
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const result = categories.map(c => ({
      name: c._id || 'Uncategorized',
      count: c.count
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductsByVendor,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};


