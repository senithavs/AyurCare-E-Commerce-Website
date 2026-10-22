/**
 * Script to hash all existing user passwords in the database
 * 
 * Run with: node scripts/hash-existing-passwords.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

async function hashExistingPasswords() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});

    if (users.length === 0) {
      console.log('ℹ️  No users found in database');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`\n🔄 Found ${users.length} user(s) to process...\n`);

    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      try {
        // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
          console.log(`⏭️  Skipping ${user.username} - password already hashed`);
          skipped++;
        } else {
          // Hash the password
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
          await user.save();
          console.log(`✅ Updated ${user.username} - password hashed`);
          updated++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${user.username}:`, error.message);
      }
    }

    console.log('\n' + '━'.repeat(50));
    console.log(`📊 Migration Summary:`);
    console.log(`   Total users: ${users.length}`);
    console.log(`   Hashed: ${updated}`);
    console.log(`   Skipped (already hashed): ${skipped}`);
    console.log('━'.repeat(50) + '\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  } catch (error) {
    console.error('\n❌ Error hashing passwords:', error.message);
    process.exit(1);
  }
}

hashExistingPasswords();

