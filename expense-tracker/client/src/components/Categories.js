import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/category.css'

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const config = {
    headers: {
      'x-auth-token': token, 
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get('http://localhost:5000/api/categories', config);
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/categories/${editId}`, { name }, config);
      setCategories(categories.map(cat => (cat._id === editId ? { ...cat, name } : cat)));
      setIsEditing(false);
      setEditId(null);
    } else {
      await axios.post('http://localhost:5000/api/categories', { name }, config);
      setCategories([...categories, { name }]); // Assuming server assigns the ID
    }
    setName('');
  };

  const handleEdit = (id, currentName) => {
    setEditId(id);
    setName(currentName);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
    setCategories(categories.filter(cat => cat._id !== id));
  };

  return (
    <div className="categories-container">
      <h1>Categories</h1>
      <form className="categories-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          required
        />
        <button type="submit">{isEditing ? 'Update Category' : 'Add Category'}</button>
      </form>
      <div className="categories-list">
        <ul>
          {categories.map(cat => (
            <li key={cat._id}>
              <span>{cat.name}</span>
              <div>
                <button onClick={() => handleEdit(cat._id, cat.name)}>Edit</button>
                <button onClick={() => handleDelete(cat._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
