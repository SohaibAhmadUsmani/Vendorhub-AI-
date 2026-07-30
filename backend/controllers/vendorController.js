// Vendor Profile Controller (Module 5)
// Handles vendor profile retrieval, creation, updates, and certification media

/**
 * @desc    Test Vendor Profile Route
 * @route   GET /api/vendors/test
 * @access  Public
 */
const getVendorTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vendor Profile API endpoint is active (Module 5)',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getVendorTest,
};
