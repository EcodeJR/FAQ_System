require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    //------------ Add username handler in the frontend ------------------
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err);
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // Destructure needed fields from user
      const { _id: id, role, username } = user;
      // Sign JWT with id, role, and username
      const token = jwt.sign(
        { id, role, username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      // Return token and user info  
      return res.json({ token, role, username });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };