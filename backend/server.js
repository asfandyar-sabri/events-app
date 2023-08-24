require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Use middleware
app.use(bodyParser.json());
app.use(cors());

// Import your route files
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');

// Use the imported routes

app.use('/auth', authRoutes);
app.use('/event', eventRoutes);

// Connect to MongoDB
db.once('open', () => {
  // Start the server after the database connection is established
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
