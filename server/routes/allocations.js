const express = require('express');
const BookAllocation = require('../models/BookAllocation');
const BookDonationDrive = require('../models/BookDonationDrive');
const School = require('../models/School');
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

// Allocate books to school (admin only)
router.post('/allocate', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { 
      donationDriveId, 
      schoolId, 
      booksAllocated, 
      notes 
    } = req.body;

    // Validate donation drive
    const donationDrive = await BookDonationDrive.findById(donationDriveId);
    if (!donationDrive) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }

    // Validate school
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if enough books are available
    const totalAllocated = Object.values(booksAllocated).reduce((sum, count) => sum + count, 0);
    
    if (totalAllocated === 0) {
      return res.status(400).json({ message: 'At least one book must be allocated' });
    }

    // Check availability for each category
    for (const category in booksAllocated) {
      if (booksAllocated[category] > donationDrive.booksReceived[category]) {
        return res.status(400).json({ 
          message: `Not enough books in category ${category}. Available: ${donationDrive.booksReceived[category]}, Requested: ${booksAllocated[category]}` 
        });
      }
    }

    const allocation = new BookAllocation({
      donationDrive: donationDriveId,
      school: schoolId,
      allocatedBy: req.user.userId,
      booksAllocated,
      totalBooksAllocated: totalAllocated,
      notes
    });

    await allocation.save();

    // Update donation drive available books
    Object.keys(booksAllocated).forEach(category => {
      donationDrive.booksReceived[category] -= booksAllocated[category];
    });
    donationDrive.totalBooksReceived -= totalAllocated;
    await donationDrive.save();

    // Update school total books received
    school.totalBooksReceived += totalAllocated;
    await school.save();

    res.status(201).json({
      message: 'Books allocated successfully',
      allocation: await BookAllocation.findById(allocation._id)
        .populate('donationDrive', 'name location')
        .populate('school', 'name address')
        .populate('allocatedBy', 'name email')
    });
  } catch (error) {
    console.error('Error allocating books:', error);
    res.status(500).json({ message: 'Server error during book allocation' });
  }
});

// Get all allocations
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const allocations = await BookAllocation.find()
      .populate('donationDrive', 'name location gatedCommunity')
      .populate('school', 'name address')
      .populate('allocatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get allocations by donation drive
router.get('/by-drive/:driveId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const allocations = await BookAllocation.find({ donationDrive: req.params.driveId })
      .populate('school', 'name address')
      .populate('allocatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations by drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get allocations by school
router.get('/by-school/:schoolId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const allocations = await BookAllocation.find({ school: req.params.schoolId })
      .populate('donationDrive', 'name location gatedCommunity')
      .populate('allocatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations by school:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update allocation status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status, deliveryDate } = req.body;
    const allocation = await BookAllocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ message: 'Allocation not found' });
    }

    allocation.status = status;
    if (status === 'delivered' && deliveryDate) {
      allocation.deliveryDate = new Date(deliveryDate);
    }

    await allocation.save();

    res.json({
      message: 'Allocation status updated successfully',
      allocation: await BookAllocation.findById(allocation._id)
        .populate('donationDrive', 'name location')
        .populate('school', 'name address')
        .populate('allocatedBy', 'name email')
    });
  } catch (error) {
    console.error('Error updating allocation status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
