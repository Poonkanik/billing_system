const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, uppercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'cashier', 'waiter'], default: 'cashier' },
  permissions: {
    allowDuplicateBill: { type: Boolean, default: false },
    allowLastBill: { type: Boolean, default: false },
    allowBillCancel: { type: Boolean, default: false },
    allowEditBill: { type: Boolean, default: false },
    allowBillDiscount: { type: Boolean, default: false },
    allowReduction: { type: Boolean, default: false },
  },
  menuAccess: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
