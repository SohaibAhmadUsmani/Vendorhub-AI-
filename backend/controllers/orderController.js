const Order = require('../models/Order');
const Quote = require('../models/Quote');
const RFQ = require('../models/RFQ');

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


// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
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
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('vendor', 'name')
      .populate('rfq')
      .populate('quote');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

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

    const allowedStatuses = [
      'pending',
      'in_progress',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
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
      order.payment.status =
        order.payment.status === 'paid' ? 'paid' : 'pending';
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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
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


module.exports = {
  createOrderFromQuote,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateDelivery,
  updateShipment,
  updateInvoice,
  updatePayment,
};