/**
 * Script to create an admin user in the database
 * 
 * Run with: node scripts/create-admin.js
 */

const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = 'mongodb+srv://admin:123@cluster0.lwyh57h.mongodb.net/?appName=Cluster0';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('📊 Admin details:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@ayurcare.com',
      password: 'admin123',
      name: 'Admin User',
      phone: '+94 70 000 0000',
      address: 'Colombo, Sri Lanka',
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('\n✅ Admin user created successfully!');
    console.log('📊 Admin credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Username: admin`);
    console.log(`   Password: admin123`);
    console.log(`   Email: admin@ayurcare.com`);
    console.log(`   Name: Admin User`);
    console.log(`   Role: admin`);
    console.log(`   Status: Active`);
    console.log(`   Created: ${adminUser.createdAt}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('📝 Duplicate key error - user might already exist');
    }
    process.exit(1);
  }
}

createAdmin();
