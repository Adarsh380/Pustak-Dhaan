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
  genre: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Children', 'Academic', 'Other']
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
  status: {
    type: String,
    enum: ['available', 'requested', 'donated'],
    default: 'available'
  },
  language: {
    type: String,
    default: 'English'
  },
  publicationYear: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
