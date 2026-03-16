const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name: name.toUpperCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: user._id, name: user.name, role: user.role,
      permissions: user.permissions, menuAccess: user.menuAccess,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// POST /api/auth/seed - Create default admin (run once)
router.post('/seed', async (req, res) => {
  try {
    const exists = await User.findOne({ name: 'ADMIN' });
    if (exists) return res.json({ message: 'Admin already exists' });
    const admin = await User.create({
      name: 'ADMIN', password: 'admin123', role: 'admin',
      permissions: {
        allowDuplicateBill: true, allowLastBill: true, allowBillCancel: true,
        allowEditBill: true, allowBillDiscount: true, allowReduction: true,
      },
      menuAccess: ['all'],
    });
    res.json({ message: 'Admin created', name: admin.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
