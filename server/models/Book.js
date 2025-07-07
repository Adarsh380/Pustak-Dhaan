const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  ageCategory: {
    type: String,
    required: true,
    enum: ['2-4', '4-6', '6-8', '8-10']
  },
  condition: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String // URLs to book images
  }],
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donationRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationRecord'
  },
  status: {
    type: String,
    enum: ['available', 'donated', 'allocated'],
    default: 'available'
  },
  language: {
    type: String,
    default: 'English'
  },
  publicationYear: {
    type: Number
  },
  isNonAcademic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
