require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  isActive: { type: Boolean, default: true },
});

let Category;
try {
  Category = mongoose.model('Category');
} catch {
  Category = mongoose.model('Category', categorySchema);
}

async function check() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const all = await Category.find({});
    console.log('\n✅ ALL Categories in DB:');
    all.forEach(c => console.log(`   • ${c.icon} ${c.name} (isActive: ${c.isActive})`));

    const active = await Category.find({ isActive: true });
    console.log('\n✅ ACTIVE Categories (isActive: true):');
    active.forEach(c => console.log(`   • ${c.icon} ${c.name}`));

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

check();
