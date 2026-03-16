const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  productCode: String,
  productName: { type: String, required: true },
  rate: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 },
  amount: { type: Number, required: true },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  group: String,
  department: String,
}, { _id: false });

const billSchema = new mongoose.Schema({
  billNo: { type: String, unique: true },
  kotNo: String,
  date: { type: Date, default: Date.now },
  table: String,
  waiter: String,
  cashier: String,
  customer: String,
  items: [billItemSchema],
  subtotal: { type: Number, default: 0 },
  cgstTotal: { type: Number, default: 0 },
  sgstTotal: { type: Number, default: 0 },
  cessTotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  reduction: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  netAmount: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Cash' },
  status: { type: String, enum: ['draft', 'kot_saved', 'billed', 'cancelled'], default: 'draft' },
  cancelReason: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

billSchema.pre('save', async function (next) {
  if (!this.billNo) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
    });
    this.billNo = `B${dateStr}${String(count + 1).padStart(4, '0')}`;
    this.kotNo = `K${dateStr}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);
