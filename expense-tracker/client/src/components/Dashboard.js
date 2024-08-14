import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './css/dashboard.css';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // State to track the total amount
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const config = {
    headers: {
      'x-auth-token': token, // Attach token to the request headers
    },
  };

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const expensesRes = await axios.get('http://localhost:5000/api/expenses', config);
        const categoriesRes = await axios.get('http://localhost:5000/api/categories', config);
        const tagsRes = await axios.get('http://localhost:5000/api/tags', config);
        if (expensesRes.data.length === 0 || categoriesRes.data.length === 0) {
          navigate('/add-expense');
        } else {
          setExpenses(expensesRes.data);
          setCategories(categoriesRes.data);
          setTags(tagsRes.data);
          setRecentExpenses(expensesRes.data.slice(-10));

          // Calculate total amount
          const total = expensesRes.data.reduce((acc, exp) => acc + exp.amount, 0);
          setTotalAmount(total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [navigate]);

  // Prepare data for Pie charts
  const categoryData = {
    labels: categories.map(cat => cat.name),
    datasets: [{
      data: categories.map(cat => expenses.filter(exp => exp.category === cat._id).length),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  const tagData = {
    labels: tags.map(tag => tag.name),
    datasets: [{
      data: tags.map(tag => expenses.filter(exp => exp.tags.includes(tag.name)).length),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  // Prepare data for Line chart
  const getChartData = () => {
    const labels = expenses.map(exp => new Date(exp.date).toLocaleDateString());
    const data = expenses.map(exp => exp.amount);

    return {
      labels,
      datasets: [{
        label: 'Expense Amount',
        data,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        fill: true
      }]
    };
  };

  const getRemainingAmountData = () => {
    const labels = expenses.map(exp => new Date(exp.date).toLocaleDateString());
    let currentTotal = 0;
    const data = expenses.map(exp => {
      currentTotal += exp.amount;
      return currentTotal;
    });

    return {
      labels,
      datasets: [{
        label: 'Total Amount Remaining',
        data,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true
      }]
    };
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="chart-section">
        <div>
          <h2>Expense Distribution by Category</h2>
          <Pie data={categoryData} />
        </div>

        <div>
          <h2>Amount Over Time</h2>
          <Line data={getChartData()} />
        </div>
        <div>
          <h2>Total Amount Remaining Over Time</h2>
          <Line data={getRemainingAmountData()} />
        </div>
      </div>
      <div className="recent-expenses">
        <h2>Recent Expenses</h2>
        <ul>
          {recentExpenses.map(exp => (
            <li key={exp._id}>{exp.summary} - {exp.date} - ${exp.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
