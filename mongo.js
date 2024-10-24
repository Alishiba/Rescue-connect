const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/University', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database Connected');
})
.catch(err => {
  console.error('Database connection error:', err);
});

// Define user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Sign up route
app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  // Check if user already exists
  User.findOne({ username: username })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).send('User already exists');
      }

      // Create and save new user
      const newUser = new User({ username, password, email });
      return newUser.save();
    })
    .then(() => {
      res.status(201).send('User created successfully');
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send('Error saving user');
    });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  User.findOne({ username: username })
    .then(user => {
      if (user && user.password === password) {
        return res.status(200).send('Login successful');
      } else {
        return res.status(401).send('Invalid credentials');
      }
    })
    .catch(err => {
      console.error('Error finding user:', err);
      res.status(500).send('Server error');
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
