const jwt = require('jsonwebtoken');

const JWT_SECRET = 'pageturner-jwt-secret-key'; // In production, use environment variable

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided, authorization denied');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified:', decoded);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check admin role
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Access denied - admin role required. User:', req.user);
    return res.status(403).json({ message: 'Access denied. Admin role required' });
  }
};

// Middleware to check if user is the resource owner or an admin
exports.isOwnerOrAdmin = (req, res, next) => {
  if (req.user) {
    // Admin has full access
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if the logged-in customer is accessing their own resources
    const requestedCustomerId = parseInt(req.params.id);
    
    if (req.user.customerId === requestedCustomerId) {
      return next();
    }
    
    console.log('Access denied - not owner. User customerId:', 
      req.user.customerId, 'Requested customerId:', requestedCustomerId);
  }
  
  return res.status(403).json({ message: 'Access denied. Not authorized' });
};

// Optional token verification - adds user data if token exists but doesn't block request if no token
exports.optionalVerifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token, continue without user data
    console.log('No token provided, continuing without authentication');
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    console.log('Optional token verification successful:', decoded);
    next();
  } catch (error) {
    // Invalid token, continue without user data
    console.error('Optional token verification failed:', error);
    next();
  }
};