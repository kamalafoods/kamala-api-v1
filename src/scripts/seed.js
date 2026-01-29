const dotenv = require('dotenv');
const { connectToDatabase } = require('../db');
const User = require('../models/User');

dotenv.config();

async function seedAdminUser() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kamala-api';

  try {
    await connectToDatabase(MONGODB_URI);

    const adminPhone = process.env.SEED_ADMIN_PHONE || '9999999999';
    const adminName = process.env.SEED_ADMIN_NAME || 'Seed Admin';

    let adminUser = await User.findOne({ phoneNumber: adminPhone });

    if (!adminUser) {
      adminUser = new User({
        phoneNumber: adminPhone,
        name: adminName,
        role: 'admin',
        isVerified: true
      });

      await adminUser.save();
      console.log('✅ Created admin user:', {
        id: adminUser._id.toString(),
        phoneNumber: adminUser.phoneNumber,
        name: adminUser.name,
        role: adminUser.role
      });
    } else {
      adminUser.role = 'admin';
      adminUser.isVerified = true;
      await adminUser.save();

      console.log('ℹ️ Updated existing user to admin:', {
        id: adminUser._id.toString(),
        phoneNumber: adminUser.phoneNumber,
        name: adminUser.name,
        role: adminUser.role
      });
    }

    console.log('\nUse this phone number to log in and get a JWT via /api/login + /api/loginconfirm:');
    console.log(`   phoneNumber: ${adminPhone}`);
  } catch (err) {
    console.error('Seed script failed:', err);
  } finally {
    process.exit(0);
  }
}

seedAdminUser();

