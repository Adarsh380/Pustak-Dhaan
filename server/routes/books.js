const express = require('express');
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

// Get all available books
router.get('/', async (req, res) => {
  try {
    const { genre, condition, search, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'available' };
    
    if (genre) query.genre = genre;
    if (condition) query.condition = condition;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query)
      .populate('donor', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('donor', 'name email phone');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error while fetching book' });
  }
});

// Add new book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, author, isbn, genre, condition, description, language, publicationYear } = req.body;

    const book = new Book({
      title,
      author,
      isbn,
      genre,
      condition,
      description,
      language,
      publicationYear,
      donor: req.user.userId
    });

    await book.save();
    
    const populatedBook = await Book.findById(book._id).populate('donor', 'name email phone');

    res.status(201).json({
      message: 'Book added successfully',
      book: populatedBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error while adding book' });
  }
});

// Update book
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user owns this book
    if (book.donor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('donor', 'name email phone');

    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error while updating book' });
  }
});

// Delete book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user owns this book
    if (book.donor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
});

// Get books by current user
router.get('/my/books', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({ donor: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({ message: 'Server error while fetching your books' });
  }
});

module.exports = router;
