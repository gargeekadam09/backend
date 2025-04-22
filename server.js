const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const customerRoutes = require('./routes/customerRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: 'https://client-rust-phi.vercel.app',  // Your frontend URL
  credentials: true,  // Allow cookies or credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));

// This handles preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoutes);

// Other routes
app.use('/api/services', serviceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('PageTurner Servicestore API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
