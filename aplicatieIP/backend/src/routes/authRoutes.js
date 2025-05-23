const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profile
router.get('/profile', auth, authController.getProfile);

// PUT /api/auth/profile
router.put('/profile', auth, authController.updateProfile);

module.exports = router; 