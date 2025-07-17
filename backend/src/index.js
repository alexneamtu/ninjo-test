const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const featureRoutes = require('./routes/featureRoutes');
const voteRoutes = require('./routes/voteRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/health', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Feature Voting API server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});