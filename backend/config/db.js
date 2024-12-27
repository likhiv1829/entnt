const mongoose = require('mongoose');

// MongoDB connection string (no need for useNewUrlParser and useUnifiedTopology)
mongoose.connect('mongodb://localhost:27017/your-database')
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
