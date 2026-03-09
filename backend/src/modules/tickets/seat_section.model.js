// src/tickets/seatSection.model.js
'use strict';
const mongoose = require('mongoose');

const seatSectionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true }, // VIP / Regular
  capacity: { type: Number, required: true },
  color: { type: String, default: '#6366f1' },
}, { timestamps: true });

const SeatSection = mongoose.model('SeatSection', seatSectionSchema);
module.exports = SeatSection;