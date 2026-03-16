const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Group = require('../models/Group');
const Department = require('../models/Department');
const Product = require('../models/Product');
const { Table, Customer } = require('../models/TableCustomer');
const { protect } = require('../middleware/auth');

// ===== COMPANY =====
router.get('/company', protect, async (req, res) => {
  try { res.json(await Company.findOne() || {}); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/company', protect, async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(company);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ===== GROUPS =====
router.get('/groups', protect, async (req, res) => {
  try { res.json(await Group.find({ isActive: true }).sort({ code: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/groups', protect, async (req, res) => {
  try { res.status(201).json(await Group.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/groups/:id', protect, async (req, res) => {
  try {
    const g = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!g) return res.status(404).json({ message: 'Not found' });
    res.json(g);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/groups/:id', protect, async (req, res) => {
  try {
    await Group.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===== DEPARTMENTS =====
router.get('/departments', protect, async (req, res) => {
  try { res.json(await Department.find({ isActive: true }).sort({ code: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/departments', protect, async (req, res) => {
  try { res.status(201).json(await Department.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/departments/:id', protect, async (req, res) => {
  try {
    const d = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json(d);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/departments/:id', protect, async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===== PRODUCTS =====
router.get('/products', protect, async (req, res) => {
  try {
    const query = {};
    if (req.query.group) query.groupName = req.query.group;
    if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
    res.json(await Product.find({ 'flags.active': true, ...query }).sort({ name: 1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/products', protect, async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/products/:id', protect, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/products/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { 'flags.active': false });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===== TABLES =====
router.get('/tables', protect, async (req, res) => {
  try { res.json(await Table.find({ isActive: true }).sort({ code: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/tables', protect, async (req, res) => {
  try { res.status(201).json(await Table.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/tables/:id', protect, async (req, res) => {
  try {
    const t = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/tables/:id', protect, async (req, res) => {
  try {
    await Table.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===== CUSTOMERS =====
router.get('/customers', protect, async (req, res) => {
  try { res.json(await Customer.find({ isActive: true }).sort({ name: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/customers', protect, async (req, res) => {
  try { res.status(201).json(await Customer.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/customers/:id', protect, async (req, res) => {
  try {
    const c = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(c);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/customers/:id', protect, async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
