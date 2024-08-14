const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  summary: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  amount: { type: Number, required: true }, // Add this line
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
