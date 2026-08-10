// Run this AFTER backend/seeders/seedDatabase.js — it depends on the vendors
// that script creates. This seeds test data for Modules 9, 10, 11.
//
// Usage:  cd backend  &&  node seeders/seedQuotesModule.js

require('dotenv').config({ path: './.env' });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const RFQ = require('../models/RFQ');
const Quote = require('../models/Quote');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const seedQuotesModule = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected.');

    await RFQ.deleteMany({});
    await Quote.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing RFQ, Quote, Conversation, Message collections.');

    let buyer = await User.findOne({ email: 'buyer@vendorhub.test' });
    if (!buyer) {
      buyer = await User.create({
        name: 'Khadija Buyer',
        email: 'buyer@vendorhub.test',
        password: 'test1234',
        role: 'buyer',
        isVerified: true,
      });
    }
    console.log('Test buyer:', buyer.email, buyer._id.toString());

    const vendors = await Vendor.find().limit(3);
    if (vendors.length < 2) {
      throw new Error('Run backend/seeders/seedDatabase.js first — no vendors found.');
    }

    const rfq = await RFQ.create({
      buyer: buyer._id,
      product: 'FIFA Pro Thermal Match Soccer Ball',
      quantity: 5000,
      material: 'Microfiber PU thermal bonded',
      budget: 90000,
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentTerms: '30% advance, 70% on shipment',
      shippingMethod: 'Sea freight',
      status: 'quoted',
    });
    console.log('Sample RFQ created:', rfq._id.toString());

    const quoteSeeds = [
      { vendor: vendors[0], price: 17.20, moq: 1000, deliveryTime: '15 days', paymentTerms: '30/70 split', warranty: '1 year', certifications: ['ISO 9001:2015', 'FIFA Quality Pro'] },
      { vendor: vendors[1] || vendors[0], price: 18.90, moq: 500, deliveryTime: '10 days', paymentTerms: '50/50 split', warranty: '6 months', certifications: ['ISO 9001:2015'] },
      { vendor: vendors[2] || vendors[0], price: 16.50, moq: 2000, deliveryTime: '22 days', paymentTerms: 'Net 30', warranty: '1 year', certifications: [] },
    ];

    const quotes = await Quote.insertMany(
      quoteSeeds.map((q) => ({
        rfq: rfq._id,
        vendor: q.vendor._id,
        buyer: buyer._id,
        price: q.price,
        currency: 'USD',
        moq: q.moq,
        deliveryTime: q.deliveryTime,
        paymentTerms: q.paymentTerms,
        warranty: q.warranty,
        certifications: q.certifications,
        status: 'submitted',
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }))
    );
    console.log(`Seeded ${quotes.length} quotes for RFQ ${rfq._id}`);

    const conversation = await Conversation.create({
      buyer: buyer._id,
      vendor: vendors[0]._id,
      rfq: rfq._id,
      lastMessage: 'Thanks for the quote — can you confirm the lead time?',
      lastMessageAt: new Date(),
    });

    await Message.create([
      {
        conversation: conversation._id,
        sender: buyer._id,
        senderRole: 'buyer',
        text: 'Hi, thanks for the quote on the match balls. Can you confirm the lead time?',
        readBy: [buyer._id],
      },
    ]);
    console.log('Sample conversation + message created:', conversation._id.toString());

    console.log('\n--- Use these for testing ---');
    console.log('Buyer login:', buyer.email, '(password: test1234)');
    console.log('RFQ ID:', rfq._id.toString());
    console.log('------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding quotes module data:', error);
    process.exit(1);
  }
};

seedQuotesModule();