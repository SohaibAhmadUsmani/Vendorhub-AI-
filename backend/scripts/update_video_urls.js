const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Vendor = require('../models/Vendor');

async function updateVideos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const result = await Vendor.updateMany({}, {
      $set: {
        videoUrl: 'https://www.youtube.com/embed/5XAxHI8sItI',
        videoTourUrl: 'https://www.youtube.com/embed/5XAxHI8sItI'
      }
    });

    console.log(`Updated ${result.modifiedCount} vendors with the video tour URL.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateVideos();
