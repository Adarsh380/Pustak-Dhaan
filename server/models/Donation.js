const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'in-transit', 'completed', 'cancelled'],
    default: 'requested'
  },
  requestMessage: {
    type: String,
    trim: true
  },
  pickupMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
