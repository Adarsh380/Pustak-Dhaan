const express = require('express');
const DonationRecord = require('../models/Donation');
const BookDonationDrive = require('../models/BookDonationDrive');
const User = require('../models/User');
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

// Submit a donation
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { donationDriveId, donationDate, booksCount } = req.body;

    // Check if donation drive exists
    const donationDrive = await BookDonationDrive.findById(donationDriveId);
    if (!donationDrive) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }

    if (donationDrive.status !== 'active') {
      return res.status(400).json({ message: 'Donation drive is not active' });
    }

    // Calculate total books
    const totalBooks = Object.values(booksCount).reduce((sum, count) => sum + count, 0);

    if (totalBooks === 0) {
      return res.status(400).json({ message: 'At least one book must be donated' });
    }

    // Create donation record
    const donationRecord = new DonationRecord({
      donor: req.user.userId,
      donationDrive: donationDriveId,
      donationDate: new Date(donationDate),
      booksCount,
      totalBooks
    });

    await donationRecord.save();

    // Update donor's total books and badge
    const donor = await User.findById(req.user.userId);
    donor.totalBooksDonatted += totalBooks;
    donor.updateBadge();
    await donor.save();

    // Update donation drive totals
    Object.keys(booksCount).forEach(category => {
      donationDrive.booksReceived[category] += booksCount[category];
    });
    donationDrive.totalBooksReceived += totalBooks;
    await donationDrive.save();

    res.status(201).json({
      message: 'Donation submitted successfully',
      donation: await DonationRecord.findById(donationRecord._id)
        .populate('donor', 'name email')
        .populate('donationDrive', 'name location')
    });
  } catch (error) {
    console.error('Donation submission error:', error);
    res.status(500).json({ message: 'Server error during donation submission' });
  }
});

// Get all donations (for admin)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const donations = await DonationRecord.find()
      .populate('donor', 'name email badge')
      .populate('donationDrive', 'name location gatedCommunity')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's donations
router.get('/my-donations', authenticateToken, async (req, res) => {
  try {
    const donations = await DonationRecord.find({ donor: req.user.userId })
      .populate('donationDrive', 'name location gatedCommunity coordinator')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation status (for coordinators/admins)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!['admin', 'coordinator'].includes(user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin or coordinator only.' });
    }

    const donation = await DonationRecord.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    if (status === 'collected') {
      donation.collectedAt = new Date();
    }
    await donation.save();

    res.json({
      message: 'Donation status updated successfully',
      donation: await DonationRecord.findById(donation._id)
        .populate('donor', 'name email')
        .populate('donationDrive', 'name location')
    });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
