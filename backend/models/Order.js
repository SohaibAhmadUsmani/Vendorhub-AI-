const mongoose = require('mongoose');

const shipmentEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
  },
  sku: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },

    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RFQ',
    },

    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
    },

    items: {
      type: [orderItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'in_progress',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    delivery: {
      expectedDate: {
        type: Date,
      },
      address: {
        type: String,
        default: '',
      },
      notes: {
        type: String,
        default: '',
      },
    },

    shipment: {
      carrier: {
        type: String,
        default: '',
      },
      trackingNumber: {
        type: String,
        default: '',
      },
      shippedAt: {
        type: Date,
      },
      deliveredAt: {
        type: Date,
      },
      timeline: {
        type: [shipmentEventSchema],
        default: [],
      },
    },

    invoice: {
      invoiceNumber: {
        type: String,
        default: '',
      },
      issuedAt: {
        type: Date,
      },
      amount: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ['pending', 'issued', 'paid', 'cancelled'],
        default: 'pending',
      },
    },

    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      method: {
        type: String,
        default: '',
      },
      transactionId: {
        type: String,
        default: '',
      },
      paidAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);