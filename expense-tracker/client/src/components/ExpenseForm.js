import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/expense.css'

const ExpenseForm = () => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState('');
  const [tagsList, setTagsList] = useState([]);
  const [amount, setAmount] = useState(''); // Add this state
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // States for search filters
  const [searchSummary, setSearchSummary] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const config = {
        headers: {
          'x-auth-token': token, // Attach token to the request headers
        },
      };
      const categoriesRes = await axios.get('http://localhost:5000/api/categories', config);
      const tagsRes = await axios.get('http://localhost:5000/api/tags', config);
      const expensesRes = await axios.get('http://localhost:5000/api/expenses', config);
      setCategories(categoriesRes.data);
      setTagsList(tagsRes.data.map(tag => tag.name));
      setExpenses(expensesRes.data);
      setFilteredExpenses(expensesRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterExpenses = () => {
      let filtered = expenses;

      if (searchSummary) {
        filtered = filtered.filter(exp => exp.summary.toLowerCase().includes(searchSummary.toLowerCase()));
      }

      if (searchCategory) {
        filtered = filtered.filter(exp => exp.category === searchCategory);
      }

      if (searchTags) {
        const searchTagsArray = searchTags.split(',').map(tag => tag.trim().toLowerCase());
        filtered = filtered.filter(exp => 
          searchTagsArray.every(tag => exp.tags.map(t => t.toLowerCase()).includes(tag))
        );
      }

      if (searchStartDate) {
        filtered = filtered.filter(exp => new Date(exp.date) >= new Date(searchStartDate));
      }

      if (searchEndDate) {
        filtered = filtered.filter(exp => new Date(exp.date) <= new Date(searchEndDate));
      }

      setFilteredExpenses(filtered);
    };

    filterExpenses();
  }, [searchSummary, searchCategory, searchTags, searchStartDate, searchEndDate, expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const config = {
      headers: {
        'x-auth-token': token, // Attach token to the request headers
      },
    };
    
    const expenseData = { summary, description, date, category, tags: tags.split(','), amount };

    if (editingExpenseId) {
      // Update existing expense
      await axios.put(`http://localhost:5000/api/expenses/${editingExpenseId}`, expenseData, config);
      setEditingExpenseId(null); // Reset editing state
    } else {
      // Create new expense
      await axios.post('http://localhost:5000/api/expenses', expenseData, config);
    }

    // Fetch updated expenses
    const expensesRes = await axios.get('http://localhost:5000/api/expenses', config);
    setExpenses(expensesRes.data);
    setFilteredExpenses(expensesRes.data);
    // Reset form
    setSummary('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
    setCategory('');
    setTags('');
    setAmount(''); // Reset amount
  };

  const handleEdit = (expense) => {
    setSummary(expense.summary);
    setDescription(expense.description);
    setDate(expense.date.slice(0, 10));
    setCategory(expense.category);
    setTags(expense.tags.join(','));
    setAmount(expense.amount); // Set amount
    setEditingExpenseId(expense._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const config = {
      headers: {
        'x-auth-token': token, // Attach token to the request headers
      },
    };
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, config);
    // Fetch updated expenses
    const expensesRes = await axios.get('http://localhost:5000/api/expenses', config);
    setExpenses(expensesRes.data);
    setFilteredExpenses(expensesRes.data);
  };

  const handleDuplicate = (expense) => {
    setSummary(expense.summary);
    setDescription(expense.description);
    setDate(new Date().toISOString().slice(0, 10)); // Set date to current date
    setCategory(expense.category);
    setTags(expense.tags.join(','));
    setAmount(expense.amount); // Set amount
    setEditingExpenseId(null); // Ensure it's treated as a new expense, not an edit
  };

  return (
   <div className="expense-form-container">
      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="0.01"
        />
        <button type="submit">
          {editingExpenseId ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      <div className="search-container">
        <h2>Search Expenses</h2>
        <input
          type="text"
          value={searchSummary}
          onChange={(e) => setSearchSummary(e.target.value)}
          placeholder="Search by Summary"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="">Search by Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
          placeholder="Search by Tags (comma-separated)"
        />
        <input
          type="date"
          value={searchStartDate}
          onChange={(e) => setSearchStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={searchEndDate}
          onChange={(e) => setSearchEndDate(e.target.value)}
          placeholder="End Date"
        />
      </div>

      <div className="expenses-list">
        <h2>All Expenses</h2>
        <ul>
          {filteredExpenses.map(expense => (
            <li key={expense._id}>
              <span>{expense.summary} - {expense.date} - {expense.amount}Rs</span>
              <button onClick={() => handleEdit(expense)}>Edit</button>
              <button onClick={() => handleDelete(expense._id)}>Delete</button>
              <button onClick={() => handleDuplicate(expense)}>Duplicate</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseForm;
