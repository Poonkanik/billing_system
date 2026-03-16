const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, uppercase: true },
  codeText: String,
  rate: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  cess: { type: Number, default: 0 },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  groupName: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  departmentName: String,
  unitName: { type: String, default: 'PCS' },
  qtyFormat: { type: Number, default: 0 },
  flags: {
    maintainStock: { type: Boolean, default: false },
    groupStock: { type: Boolean, default: false },
    closingStockClear: { type: Boolean, default: false },
    godownStock: { type: Boolean, default: false },
    barItem: { type: Boolean, default: false },
    hotKey: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    allowGst: { type: Boolean, default: false },
    fastMoving: { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
