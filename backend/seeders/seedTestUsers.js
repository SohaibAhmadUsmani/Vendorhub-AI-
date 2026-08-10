require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const testUsers = [
    {
        name: 'Test Buyer',
        email: 'buyer.test@vendorhub.com',
        password: 'Test@12345',
        role: 'buyer'
    },
    {
        name: 'Test Vendor',
        email: 'vendor.test@vendorhub.com',
        password: 'Test@12345',
        role: 'vendor'
    },
    {
        name: 'Test Admin',
        email: 'admin.test@vendorhub.com',
        password: 'Test@12345',
        role: 'admin'
    }
];

const seedTestUsers = async () => {
    try {
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://vendorhub:vendorhub123@cluster0.lxzbk8y.mongodb.net/vendorhub-ai?appName=Cluster0';
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        console.log('Connecting to MongoDB...');

        await mongoose.connect(mongoUri);

        console.log('Connected to MongoDB successfully.');

        for (const testUser of testUsers) {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);

            const user = await User.findOneAndUpdate(
                { email: testUser.email },
                {
                    name: testUser.name,
                    email: testUser.email,
                    password: hashedPassword,
                    role: testUser.role,
                    isVerified: true,
                    twoFAEnabled: false,
                    verificationToken: null,
                    verificationTokenExpires: null
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );

            console.log(
                `Created/updated ${user.role}: ${user.email}`
            );
        }

        console.log('\nTest users seeded successfully!\n');

        console.log('Login credentials:');
        console.log('-----------------------------------');
        console.log('BUYER');
        console.log('Email: buyer.test@vendorhub.com');
        console.log('Password: Test@12345');
        console.log('');
        console.log('VENDOR');
        console.log('Email: vendor.test@vendorhub.com');
        console.log('Password: Test@12345');
        console.log('');
        console.log('ADMIN');
        console.log('Email: admin.test@vendorhub.com');
        console.log('Password: Test@12345');
        console.log('-----------------------------------');

        process.exit(0);

    } catch (error) {
        console.error('Error seeding test users:', error);
        process.exit(1);
    }
};

seedTestUsers();