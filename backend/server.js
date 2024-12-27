const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const companyRoutes = require('./routes/companyRoutes');
const communicationRoutes = require('./routes/communicationRoutes');

const app = express();

// Enable CORS for all origins (You can specify domains if needed)
app.use(cors()); // This will allow your frontend to make requests

// Middleware
app.use(express.json());

// Use routes
app.use('/api', companyRoutes); // All routes in companyRoutes will start with '/api'
app.use('/api', communicationRoutes); // Communication routes also start with '/api'

// MongoDB connection
mongoose.connect('mongodb://localhost/calendar-communication-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Server setup
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
