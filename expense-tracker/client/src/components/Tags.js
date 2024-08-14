import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState('');
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const config = {
    headers: {
      'x-auth-token': token, // Attach token to the request headers
    },
  };

  useEffect(() => {
    const fetchTags = async () => {
      const res = await axios.get('http://localhost:5000/api/tags',config);
      setTags(res.data);
    };
    fetchTags();
  }, []);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (newTagName.trim() === '') return;
    try {
      const res = await axios.post('http://localhost:5000/api/tags', { name: newTagName }, config);
      setTags([...tags, res.data]);
      setNewTagName('');
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  const handleUpdateTag = async (e) => {
    e.preventDefault();
    if (editTagName.trim() === '') return;
    try {
      const res = await axios.put(`http://localhost:5000/api/tags/${editTagId}`, { name: editTagName },config);
      setTags(tags.map(tag => tag._id === editTagId ? res.data : tag));
      setEditTagId(null);
      setEditTagName('');
    } catch (err) {
      console.error('Error updating tag:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tags/${id}`,config);
      setTags(tags.filter(tag => tag._id !== id));
    } catch (err) {
      console.error('Error deleting tag:', err);
    }
  };

  const handleEditClick = (id, name) => {
    setEditTagId(id);
    setEditTagName(name);
  };

  return (
    <div>
      <h1>Tags</h1>

      <form onSubmit={handleAddTag}>
        <h2>Add New Tag</h2>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name"
        />
        <button type="submit">Add Tag</button>
      </form>

      {editTagId && (
        <form onSubmit={handleUpdateTag}>
          <h2>Update Tag</h2>
          <input
            type="text"
            value={editTagName}
            onChange={(e) => setEditTagName(e.target.value)}
            placeholder="Edit tag name"
          />
          <button type="submit">Update Tag</button>
          <button type="button" onClick={() => setEditTagId(null)}>Cancel</button>
        </form>
      )}

      <ul>
        {tags.map(tag => (
          <li key={tag._id}>
            {tag.name} 
            <button onClick={() => handleEditClick(tag._id, tag.name)}>Edit</button>
            <button onClick={() => handleDelete(tag._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
