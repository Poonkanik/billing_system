const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { protect } = require('../middleware/auth');

const getDateRange = (from, to) => ({
  $gte: new Date(new Date(from).setHours(0, 0, 0, 0)),
  $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
});

// Bill Wise Sales
router.get('/bill-wise', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const bills = await Bill.find({ status: 'billed', date: getDateRange(from, to) }).sort({ date: -1 });
    res.json(bills);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Item Wise Sales
router.get('/item-wise', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await Bill.aggregate([
      { $match: { status: 'billed', date: getDateRange(from, to) } },
      { $unwind: '$items' },
      { $group: { _id: '$items.productName', qty: { $sum: '$items.qty' }, amount: { $sum: '$items.amount' }, rate: { $first: '$items.rate' } } },
      { $sort: { amount: -1 } },
    ]);
    res.json(result.map(r => ({ name: r._id, qty: r.qty, rate: r.rate, amount: r.amount })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Salesman Wise Sales
router.get('/salesman-wise', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await Bill.aggregate([
      { $match: { status: 'billed', date: getDateRange(from, to) } },
      { $group: { _id: '$waiter', bills: { $sum: 1 }, amount: { $sum: '$netAmount' } } },
      { $sort: { amount: -1 } },
    ]);
    res.json(result.map(r => ({ name: r._id || 'Unknown', bills: r.bills, amount: r.amount })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Group Wise Sales
router.get('/group-wise', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await Bill.aggregate([
      { $match: { status: 'billed', date: getDateRange(from, to) } },
      { $unwind: '$items' },
      { $group: { _id: '$items.group', qty: { $sum: '$items.qty' }, amount: { $sum: '$items.amount' } } },
      { $sort: { amount: -1 } },
    ]);
    res.json(result.map(r => ({ group: r._id || 'Other', qty: r.qty, amount: r.amount })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Time Wise Sales
router.get('/time-wise', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await Bill.aggregate([
      { $match: { status: 'billed', date: getDateRange(from, to) } },
      { $group: { _id: { $hour: '$date' }, bills: { $sum: 1 }, amount: { $sum: '$netAmount' } } },
      { $sort: { '_id': 1 } },
    ]);
    res.json(result.map(r => ({ time: `${String(r._id).padStart(2, '0')}:00`, bills: r.bills, amount: r.amount })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Cashier Wise Sales
router.get('/cashier-wise', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await Bill.aggregate([
      { $match: { status: 'billed', date: getDateRange(from, to) } },
      { $group: { _id: '$cashier', bills: { $sum: 1 }, amount: { $sum: '$netAmount' } } },
      { $sort: { amount: -1 } },
    ]);
    res.json(result.map(r => ({ cashier: r._id || 'Unknown', bills: r.bills, amount: r.amount })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Sales Tax Report
router.get('/tax-report', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await Bill.aggregate([
      { $match: { status: 'billed', date: getDateRange(from, to) } },
      { $group: { _id: null, subtotal: { $sum: '$subtotal' }, cgst: { $sum: '$cgstTotal' }, sgst: { $sum: '$sgstTotal' }, net: { $sum: '$netAmount' }, bills: { $sum: 1 } } },
    ]);
    res.json(result[0] || { subtotal: 0, cgst: 0, sgst: 0, net: 0, bills: 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Dashboard summary
router.get('/dashboard', protect, async (req, res) => {
  try {
    const today = new Date();
    const todayRange = getDateRange(today.toISOString(), today.toISOString());
    const [todaySales, totalBills, runningBills] = await Promise.all([
      Bill.aggregate([{ $match: { status: 'billed', date: todayRange } }, { $group: { _id: null, total: { $sum: '$netAmount' }, count: { $sum: 1 } } }]),
      Bill.countDocuments({ status: 'billed' }),
      Bill.countDocuments({ status: 'kot_saved' }),
    ]);
    res.json({ todaySales: todaySales[0] || { total: 0, count: 0 }, totalBills, runningBills });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
