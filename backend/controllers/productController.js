// Product Catalog Controller (Module 6)
// Handles product listing, filtering, creation, specifications, and inventory

/**
 * @desc    Test Product Catalog Route
 * @route   GET /api/products/test
 * @access  Public
 */
const getProductTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Product Catalog API endpoint is active (Module 6)',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getProductTest,
};
