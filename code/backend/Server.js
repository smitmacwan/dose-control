const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Encrypt password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

// Routes

// Register Route
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Login Route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found');
          return res.status(400).json({ msg: 'User does not exist' });
      }

      // Log the user object and the provided password
      console.log('User found:', user);
      console.log('Provided Password:', password);
      console.log('Stored Password Hash:', user.password);

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch); // Log the result of the comparison

      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ msg: 'Server Error' });
  }
});


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
