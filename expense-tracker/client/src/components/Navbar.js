import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/add-expense">Add Expense</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/tags">Tags</Link></li>
        </ul>
      </div>
      <div className="profile-container" onClick={toggleDropdown}>
        <FaUserCircle className="profile-icon" />
        {showDropdown && (
          <div className="dropdown-menu">
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
