const express = require('express');
const Donation = require('../models/Donation');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Request a book donation
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { bookId, requestMessage, pickupMethod, pickupAddress } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'available') {
      return res.status(400).json({ message: 'Book is not available for donation' });
    }

    // Check if user is not requesting their own book
    if (book.donor.toString() === req.user.userId) {
      return res.status(400).json({ message: 'You cannot request your own book' });
    }

    // Create donation request
    const donation = new Donation({
      book: bookId,
      donor: book.donor,
      recipient: req.user.userId,
      requestMessage,
      pickupMethod,
      pickupAddress
    });

    await donation.save();

    // Update book status
    book.status = 'requested';
    await book.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate('book', 'title author')
      .populate('donor', 'name email phone')
      .populate('recipient', 'name email phone');

    res.status(201).json({
      message: 'Donation request sent successfully',
      donation: populatedDonation
    });
  } catch (error) {
    console.error('Request donation error:', error);
    res.status(500).json({ message: 'Server error while requesting donation' });
  }
});

// Get donation requests for current user (as donor)
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.userId })
      .populate('book', 'title author')
      .populate('recipient', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Get donation requests error:', error);
    res.status(500).json({ message: 'Server error while fetching donation requests' });
  }
});

// Get my donation history (as recipient)
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const donations = await Donation.find({ recipient: req.user.userId })
      .populate('book', 'title author')
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Server error while fetching your requests' });
  }
});

// Approve/Reject donation request
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation request not found' });
    }

    // Check if user is the donor
    if (donation.donor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    donation.status = status;
    
    if (status === 'approved') {
      donation.approvedAt = new Date();
    } else if (status === 'completed') {
      donation.completedAt = new Date();
      
      // Update book status to donated
      await Book.findByIdAndUpdate(donation.book, { status: 'donated' });
    } else if (status === 'cancelled') {
      // Make book available again
      await Book.findByIdAndUpdate(donation.book, { status: 'available' });
    }

    await donation.save();

    const updatedDonation = await Donation.findById(donation._id)
      .populate('book', 'title author')
      .populate('donor', 'name email phone')
      .populate('recipient', 'name email phone');

    res.json({
      message: 'Donation status updated successfully',
      donation: updatedDonation
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ message: 'Server error while updating donation status' });
  }
});

// Get single donation
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('book', 'title author')
      .populate('donor', 'name email phone')
      .populate('recipient', 'name email phone');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user is involved in this donation
    if (donation.donor._id.toString() !== req.user.userId && 
        donation.recipient._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this donation' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error while fetching donation' });
  }
});

module.exports = router;
