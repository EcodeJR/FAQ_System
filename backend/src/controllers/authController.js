require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WhitelistedEmail = require('../models/WhitelistedEmail');

exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if role is valid
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // If role is admin, check if email is whitelisted
    if (role === 'admin') {
      const isWhitelisted = await WhitelistedEmail.findOne({ email });
      if (!isWhitelisted || isWhitelisted.allowedRole !== 'admin') {
        return res.status(403).json({ 
          message: 'This email is not authorized to register as admin.' 
        });
      }
    }

    // Create and save new user
    const user = new User({ username, email, password, role });
    await user.save();
    
    return res.status(201).json({ 
      message: 'User registered successfully' 
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ 
      message: 'An error occurred during registration' 
    });
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