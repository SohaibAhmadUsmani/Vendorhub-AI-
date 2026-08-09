require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

  const buyer = await User.findOne({ email: 'buyer@vendorhub.test' });
  if (!buyer) {
    console.error('Test buyer not found — run seedQuotesModule.js first.');
    process.exit(1);
  }

  const token = jwt.sign(
    { id: buyer._id.toString(), role: buyer.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('\n--- Test JWT (valid 7 days) ---');
  console.log(token);
  console.log('--------------------------------\n');
  console.log('To use it in the browser:');
  console.log('1. Open http://localhost:5173, press F12 → Console tab');
  console.log(`2. Run: localStorage.setItem('token', '${token}')`);
  console.log(`3. Run: localStorage.setItem('userId', '${buyer._id.toString()}')`);
  console.log('4. Refresh the page — /buyer/quotes and /buyer/messages will now be authenticated.\n');

  process.exit(0);
})();