const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { protect } = require('../middleware/auth');

// GET all active bills (not cancelled)
router.get('/', protect, async (req, res) => {
  try {
    const query = { status: { $ne: 'cancelled' } };
    if (req.query.status) query.status = req.query.status;
    if (req.query.date) {
      const d = new Date(req.query.date);
      query.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }
    res.json(await Bill.find(query).sort({ createdAt: -1 }).limit(100));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single bill
router.get('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Not found' });
    res.json(bill);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create bill
router.post('/', protect, async (req, res) => {
  try {
    const bill = await Bill.create({ ...req.body, createdBy: req.user._id, cashier: req.user.name });
    res.status(201).json(bill);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update bill
router.put('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bill) return res.status(404).json({ message: 'Not found' });
    res.json(bill);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE (cancel) bill
router.delete('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id,
      { status: 'cancelled', cancelReason: req.body.reason || 'Cancelled' }, { new: true });
    res.json(bill);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
