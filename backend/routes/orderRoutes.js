const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const {
  createOrderFromQuote,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateDelivery,
  updateShipment,
  updateInvoice,
  updatePayment,
  initiatePayment,
} = require('../controllers/orderController');

const router = express.Router();

// Module 12 — Order Management Routes
// Order creation & retrieval
router.post('/', authMiddleware, roleMiddleware('buyer'), createOrderFromQuote);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);

// Order management
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.patch('/:id/delivery', authMiddleware, updateDelivery);
router.patch('/:id/shipment', authMiddleware, updateShipment);
router.patch('/:id/invoice', authMiddleware, updateInvoice);
router.patch('/:id/payment', authMiddleware, updatePayment);

// Payments
router.post('/:id/payment-intent', authMiddleware, initiatePayment);

module.exports = router;