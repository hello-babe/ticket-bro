// src/tickets/ticket.model.js
'use strict';
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  type: { type: String, required: true }, // e.g., VIP, General
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'BDT' },
  quantity: { type: Number, required: true, min: 0 },
  sold: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  maxPerOrder: { type: Number, default: 10 },
  minPerOrder: { type: Number, default: 1 },
  salesStart: { type: Date },
  salesEnd: { type: Date },
  isActive: { type: Boolean, default: true },
  perks: [{ type: String }],
  deletedAt: { type: Date, default: null, index: true },
}, { timestamps: true });

ticketSchema.virtual('available').get(function() {
  return Math.max(0, this.quantity - this.sold - this.reserved);
});

ticketSchema.virtual('isDeleted').get(function() {
  return !!this.deletedAt;
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;