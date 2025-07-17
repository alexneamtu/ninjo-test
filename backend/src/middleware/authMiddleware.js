const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = {
  // Middleware to verify JWT token
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided or invalid format.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.status(401).json({ error: 'Token verification failed' });
      }
    }
  },

  // Optional middleware - passes through if no token, but sets user if valid token
  optionalAuth: (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Continue without user if token is invalid
    }
    
    next();
  }
};

module.exports = authMiddleware;