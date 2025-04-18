const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const customerRoutes = require('./routes/customerRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your client's address
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoutes);

// Service routes - read operations public, write operations protected
app.use('/api/services', serviceRoutes);

// Customer routes - temporarily removing strict authentication
app.use('/api/customers', customerRoutes);

// Sales routes - temporarily removing strict authentication
app.use('/api/sales', saleRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('PageTurner Servicestore API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});