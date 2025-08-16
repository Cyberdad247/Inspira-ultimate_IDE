// Authentication Routes
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const AuthService = require('../auth/service');
const authService = new AuthService();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

router.post('/login', authLimiter, [
  body('username').trim().isLength({ min: 3 }).escape(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(username, password);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/register', authLimiter, [
  body('username').trim().isLength({ min: 3 }).escape(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    await authService.register(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/refresh', authLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    const { accessToken, newRefreshToken } = await authService.refreshToken(refreshToken);
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await authService.verifyToken(token);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

module.exports = router;