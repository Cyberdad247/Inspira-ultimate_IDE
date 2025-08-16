// Main API Router
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const aiRoutes = require('./aiRoutes');
const contextRoutes = require('./contextRoutes');
const diffRoutes = require('./diffRoutes');

// Mount individual route files
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/context', contextRoutes);
router.use('/diff', diffRoutes);

module.exports = router;