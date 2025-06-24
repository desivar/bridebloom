const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (userData) => {
  const { email, role = 'customer', weddingDate } = userData;
  
  if (role === 'customer' && !weddingDate) {
    throw new Error('Wedding date is required for customers');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({
    ...userData,
    password: hashedPassword,
    ...(role === 'customer' && { weddingDate })
  });

  await user.save();
  
  const token = jwt.sign(
    { userId: user._id, role: user.role }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '1h' }
  );

  return { token, user };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '1h' }
  );

  return { token, user };
};

module.exports = { register, login };