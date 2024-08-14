const express = require('express');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create expense
router.post('/', authMiddleware, async (req, res) => {
  const { summary, description, date, category, tags, amount } = req.body;
  console.log(summary, description, date, category, tags)
  try {
    const newExpense = new Expense({ summary, description, date, category, tags, amount, user: req.user._id });
    console.log(newExpense)
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all expenses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get expense by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update expense
router.put('/:id', authMiddleware, async (req, res) => {
  const { summary, description, date, category, tags, amount } = req.body;
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    expense.summary = summary || expense.summary;
    expense.description = description || expense.description;
    expense.date = date || expense.date;
    expense.category = category || expense.category;
    expense.tags = tags || expense.tags;
    expense.amount = amount || expense.amount;

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    console.log(expense)
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
