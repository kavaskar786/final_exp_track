const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create category
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all categories
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update category
router.put('/:id', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });

    category.name = name || category.name;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });

    await category.remove();
    res.json({ msg: 'Category removed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
