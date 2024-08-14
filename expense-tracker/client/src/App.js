import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ExpenseForm from './components/ExpenseForm';
import Categories from './components/Categories';
import Tags from './components/Tags';
import Navbar from './components/Navbar';

function App() {
  return (

    <Router>
      {/* <div> this is to test the page</div> */}
      {/* <Dashboard/> */}
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/add-expense" element={<ExpenseForm/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/tags" element={<Tags/>} />
      </Routes>
    </Router>
  );
}

export default App;
