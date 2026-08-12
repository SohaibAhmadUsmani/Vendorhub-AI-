require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const result = await Vendor.updateMany({}, {
        $set: {
          videoTourUrl: 'https://www.youtube.com/watch?v=5XAxHI8sItI'
        }
      });
      console.log(`Updated ${result.modifiedCount} vendors with the video tour URL.`);
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  });
