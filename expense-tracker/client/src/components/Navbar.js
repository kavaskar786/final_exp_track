import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {/* <li><Link to="/register">Register</Link></li> */}
        <li><Link to="/add-expense">Add Expense</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/tags">Tags</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
