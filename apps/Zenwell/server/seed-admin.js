const User = require('./models/User');
const connectDB = require('./db.js');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const existing = await User.findOne({ username: 'admin123' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit();
    }

    await User.create({
      username: 'admin123',
      password: 'admin12345',
      email: 'admin@zenwell.com',
      role: 'admin'
    });

    console.log('✓ Admin user created: admin123 / admin12345');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();