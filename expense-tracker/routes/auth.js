const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    // console.log(salt,username,password);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword)
    const newUser = new User({ username, password: hashedPassword });
    // console.log(newUser)
    await newUser.save();
    res.status(200).json({ msg: 'User registered' });
    console.log('User registered');
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    // console.log("reached here",user)
    if (!user) {
      // console.log("User does not exist");
      return res.status(400).json({ msg: 'User does not exist' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(user.password,isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;


//what is sync and async
