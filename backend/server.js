import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/intern-dashboard');
    console.log('🔗 MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// User Schema with advanced features
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  referralCode: {
    type: String,
    unique: true,
    default: function() {
      return this.name.toLowerCase().replace(/\s+/g, '') + Date.now().toString().slice(-4);
    }
  },
  donations: {
    type: Number,
    default: Math.floor(Math.random() * 5000) + 500 // Random initial donation
  },
  rewards: [{
    title: String,
    threshold: Number,
    unlocked: Boolean,
    unlockedAt: Date
  }],
  role: {
    type: String,
    enum: ['intern', 'admin'],
    default: 'intern'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  refreshToken: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current level based on donations
userSchema.virtual('level').get(function() {
  if (this.donations >= 10000) return 'Platinum';
  if (this.donations >= 5000) return 'Gold';
  if (this.donations >= 2500) return 'Silver';
  if (this.donations >= 1000) return 'Bronze';
  return 'Starter';
});

// Pre-save middleware to hash password and update rewards
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update rewards based on donations
userSchema.pre('save', function(next) {
  const rewardTiers = [
    { title: 'Welcome Bonus', threshold: 0 },
    { title: 'Bronze Badge', threshold: 1000 },
    { title: 'Silver Medal', threshold: 2500 },
    { title: 'Gold Trophy', threshold: 5000 },
    { title: 'Platinum Crown', threshold: 10000 }
  ];

  this.rewards = rewardTiers.map(reward => ({
    ...reward,
    unlocked: this.donations >= reward.threshold,
    unlockedAt: this.donations >= reward.threshold ? new Date() : null
  }));

  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT tokens
userSchema.methods.generateTokens = function() {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

const User = mongoose.model('User', userSchema);

// Advanced JWT Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 6 characters with uppercase, lowercase, and number')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Register user
app.post('/api/auth/register', validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({ name, email, password });
    const { accessToken, refreshToken } = user.generateTokens();
    
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
app.post('/api/auth/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = user.generateTokens();
    
    // Update last login and refresh token
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret');
    const user = await User.findOne({ 
      _id: decoded.id, 
      refreshToken,
      isActive: true 
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const tokens = user.generateTokens();
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});


app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    // DON'T use .lean() so virtuals are included
    const user = await User.findById(req.user._id)
      .select('-password -refreshToken');

    // Convert to object to include virtuals, then use toJSON to ensure virtuals are included
    const userObject = user.toJSON();

    // Calculate additional stats
    const stats = {
      daysActive: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)),
      rewardsUnlocked: user.rewards.filter(r => r.unlocked).length,
      nextReward: user.rewards.find(r => !r.unlocked),
      progressToNext: user.rewards.find(r => !r.unlocked) 
        ? ((user.donations / user.rewards.find(r => !r.unlocked).threshold) * 100).toFixed(1)
        : 100
    };

    res.json({
      success: true,
      data: {
        ...userObject,
        stats
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// Update donations (admin or simulation)
app.patch('/api/user/donations', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid donation amount required'
      });
    }

    const user = await User.findById(req.user._id);
    user.donations += amount;
    await user.save();

    res.json({
      success: true,
      message: 'Donations updated successfully',
      data: {
        newTotal: user.donations,
        level: user.level,
        rewardsUnlocked: user.rewards.filter(r => r.unlocked).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating donations'
    });
  }
});

app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    // Remove .lean() to include virtuals
    const leaderboard = await User.find({ isActive: true })
      .select('name donations level createdAt')
      .sort({ donations: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Convert to JSON to include virtuals
    const leaderboardWithVirtuals = leaderboard.map(user => user.toJSON());

    // Add rank and additional info
    const enrichedLeaderboard = leaderboardWithVirtuals.map((user, index) => ({
      ...user,
      rank: parseInt(skip) + index + 1,
      isCurrentUser: user._id.toString() === req.user._id.toString()
    }));

    // Get current user's rank if not in top results
    const currentUserRank = await User.countDocuments({
      donations: { $gt: req.user.donations },
      isActive: true
    }) + 1;

    // Get current user with virtuals
    const currentUser = await User.findById(req.user._id).select('donations level');

    res.json({
      success: true,
      data: {
        leaderboard: enrichedLeaderboard,
        currentUser: {
          rank: currentUserRank,
          donations: currentUser.donations,
          level: currentUser.level // This will now include the virtual field
        },
        totalUsers: await User.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 }
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Initialize server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();