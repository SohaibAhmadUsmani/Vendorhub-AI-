const express = require('express');

const {
  createOrderFromQuote,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateDelivery,
  updateShipment,
  updateInvoice,
  updatePayment,
} = require('../controllers/orderController');

const router = express.Router();

// Order creation & retrieval
router.post('/', createOrderFromQuote);
router.get('/', getOrders);
router.get('/:id', getOrderById);

// Order management
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/delivery', updateDelivery);
router.patch('/:id/shipment', updateShipment);
router.patch('/:id/invoice', updateInvoice);
router.patch('/:id/payment', updatePayment);

module.exports = router;