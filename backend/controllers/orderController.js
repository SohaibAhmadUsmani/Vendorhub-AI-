const Order = require('../models/Order');
const Quote = require('../models/Quote');
const RFQ = require('../models/RFQ');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Stripe = require('stripe');

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const ORDER_STATUSES = [
  'pending',
  'in_progress',
  'shipped',
  'delivered',
  'cancelled',
];

const INVOICE_STATUSES = ['pending', 'issued', 'paid', 'cancelled'];

const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const ALLOWED_TRANSITIONS = {
  pending: ['in_progress', 'cancelled'],
  in_progress: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

/**
 * Resolve the Vendor document owned by the requesting user (matched by the
 * contact email used at signup). Returns null when no vendor is owned.
 */
async function resolveVendorForUser(userId) {
  const user = await User.findById(userId).lean();
  if (!user) return null;
  return Vendor.findOne({ 'contact.email': user.email }).lean();
}

/**
 * Check whether the authenticated user may access the given order.
 * - Admin: full access
 * - Buyer: only their own orders
 * - Vendor: only orders for their own vendor profile
 */
async function canAccessOrder(req, order) {
  if (req.user.role === 'admin') return true;

  if (req.user.role === 'buyer') {
    return order.buyer.toString() === req.user.id;
  }

  if (req.user.role === 'vendor') {
    const vendor = await resolveVendorForUser(req.user.id);
    return !!vendor && order.vendor.toString() === vendor._id.toString();
  }

  return false;
}

/** Fetch an order and enforce role-based access. Sends a 404/403 response. */
async function loadOrderForUser(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return null;
  }
  if (!(await canAccessOrder(req, order))) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return null;
  }
  return order;
}

// Create order from an accepted quote
const createOrderFromQuote = async (req, res) => {
  try {
    const { quoteId } = req.body;

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: 'quoteId is required',
      });
    }

    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    if (quote.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Only an accepted quote can be converted into an order',
      });
    }

    if (quote.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only convert your own quotes into orders',
      });
    }

    const rfq = await RFQ.findById(quote.rfq);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: 'Related RFQ not found',
      });
    }

    const existingOrder = await Order.findOne({
      quote: quote._id,
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: 'An order already exists for this quote',
        order: existingOrder,
      });
    }

    const quantity = Number(rfq.quantity);
    const unitPrice = Number(quote.price);
    const subtotal = quantity * unitPrice;

    const order = await Order.create({
      buyer: quote.buyer,
      vendor: quote.vendor,
      rfq: quote.rfq,
      quote: quote._id,

      items: [
        {
          productName: rfq.product,
          quantity,
          unitPrice,
        },
      ],

      subtotal,
      total: subtotal,

      status: 'pending',

      delivery: {
        expectedDate: rfq.deliveryDate,
        address: '',
        notes: '',
      },

      invoice: {
        amount: subtotal,
        status: 'pending',
      },

      payment: {
        status: 'pending',
        method: '',
      },

      shipment: {
        timeline: [
          {
            status: 'Order created',
            note: 'Order created from accepted quote',
          },
        ],
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all orders visible to the requesting user
const getOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'buyer') {
      filter.buyer = req.user.id;
    } else if (req.user.role === 'vendor') {
      const vendor = await resolveVendorForUser(req.user.id);
      if (!vendor) {
        return res.status(200).json({ success: true, count: 0, orders: [] });
      }
      filter.vendor = vendor._id;
    }

    const orders = await Order.find(filter)
      .populate('buyer', 'name email')
      .populate('vendor', 'name')
      .populate('rfq')
      .populate('quote')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await loadOrderForUser(req, res);
    if (!order) return;

    await order.populate([
      { path: 'buyer', select: 'name email' },
      { path: 'vendor', select: 'name' },
      { path: 'rfq' },
      { path: 'quote' },
    ]);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await loadOrderForUser(req, res);
    if (!order) return;

    const allowedNext = ALLOWED_TRANSITIONS[order.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot move order from "${order.status}" to "${status}". Allowed: ${allowedNext.join(', ') || 'none'}`,
      });
    }

    order.status = status;

    order.shipment.timeline.push({
      status,
      note: `Order status changed to ${status}`,
      timestamp: new Date(),
    });

    if (status === 'shipped') {
      order.shipment.shippedAt = new Date();
    }

    if (status === 'delivered') {
      order.shipment.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update delivery information
const updateDelivery = async (req, res) => {
  try {
    const { expectedDate, address, notes } = req.body;

    const order = await loadOrderForUser(req, res);
    if (!order) return;

    if (expectedDate !== undefined) {
      order.delivery.expectedDate = expectedDate;
    }

    if (address !== undefined) {
      order.delivery.address = address;
    }

    if (notes !== undefined) {
      order.delivery.notes = notes;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Delivery information updated successfully',
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Update shipment information
const updateShipment = async (req, res) => {
  try {
    const {
      carrier,
      trackingNumber,
      status,
      location,
      note,
    } = req.body;

    const order = await loadOrderForUser(req, res);
    if (!order) return;

    if (carrier !== undefined) {
      order.shipment.carrier = carrier;
    }

    if (trackingNumber !== undefined) {
      order.shipment.trackingNumber = trackingNumber;
    }

    if (status) {
      order.shipment.timeline.push({
        status,
        location: location || '',
        note: note || '',
        timestamp: new Date(),
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Shipment information updated successfully',
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      issuedAt,
      amount,
      status,
    } = req.body;

    const order = await loadOrderForUser(req, res);
    if (!order) return;

    if (status !== undefined && !INVOICE_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice status',
      });
    }

    if (invoiceNumber !== undefined) {
      order.invoice.invoiceNumber = invoiceNumber;
    }

    if (issuedAt !== undefined) {
      order.invoice.issuedAt = issuedAt;
    }

    if (amount !== undefined) {
      order.invoice.amount = Number(amount);
    }

    if (status !== undefined) {
      order.invoice.status = status;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Update payment
const updatePayment = async (req, res) => {
  try {
    const {
      status,
      method,
      transactionId,
    } = req.body;

    const order = await loadOrderForUser(req, res);
    if (!order) return;

    if (status !== undefined && !PAYMENT_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    if (status !== undefined) {
      order.payment.status = status;
    }

    if (method !== undefined) {
      order.payment.method = method;
    }

    if (transactionId !== undefined) {
      order.payment.transactionId = transactionId;
    }

    if (status === 'paid') {
      order.payment.paidAt = new Date();
      order.invoice.status = 'paid';
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Initiate a card payment for an order (Stripe PaymentIntent)
const initiatePayment = async (req, res) => {
  try {
    const order = await loadOrderForUser(req, res);
    if (!order) return;

    let clientSecret = null;
    let transactionId = null;

    if (stripe) {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.total || 0) * 100),
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber || '',
        },
      });
      clientSecret = intent.client_secret;
      transactionId = intent.id;
    }

    return res.status(200).json({
      success: true,
      message: stripe
        ? 'Payment intent created'
        : 'Payment gateway not configured — simulated intent returned',
      orderId: order._id,
      total: order.total,
      clientSecret,
      transactionId,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createOrderFromQuote,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateDelivery,
  updateShipment,
  updateInvoice,
  updatePayment,
  initiatePayment,
};