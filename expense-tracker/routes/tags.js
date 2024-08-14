const express = require('express');
const Tag = require('../models/Tag');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create tag
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const newTag = new Tag({ name });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all tags
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update tag
router.put('/:id', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ msg: 'Tag not found' });

    tag.name = name || tag.name;
    await tag.save();
    res.json(tag);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete tag
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ msg: 'Tag not found' });

    await tag.remove();
    res.json({ msg: 'Tag removed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
