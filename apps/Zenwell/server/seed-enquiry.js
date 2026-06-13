const mongoose = require('mongoose');
const Enquiry = require('./models/Enquiry');
require('dotenv').config();

const seedEnquiry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenwell');

    // Clear existing enquiries
    await Enquiry.deleteMany({});

    // Create sample enquiries
    await Enquiry.insertMany([
      {
        name: 'Priya Sharma',
        email: 'priya@email.com',
        phone: '9876543210',
        product: 'Premium Yoga Mat',
        message: 'Is this mat suitable for hot yoga? Need durability info.',
        status: 'New'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        phone: '9876543211',
        product: 'Meditation Cushion',
        message: 'What is the height of this cushion? I have back issues.',
        status: 'Contacted'
      },
      {
        name: 'Amit Singh',
        email: 'amit@email.com',
        phone: '9876543212',
        product: 'Ashwagandha Powder',
        message: 'Is this organic certified? Any side effects?',
        status: 'New'
      }
    ]);

    console.log('✓ Enquiry collection created with sample data');
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedEnquiry();
