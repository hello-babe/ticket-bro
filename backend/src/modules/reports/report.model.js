// ============================================================
//  REPORT MODEL (Moderation)
//  src/modules/reports/report.model.js
// ============================================================

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    reportId: {
      type: String,
      unique: true,
      default: () =>
        `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    },

    entityType: {
      type: String,
      required: true,
      enum: ["event", "user", "organizer", "message", "review", "comment"],
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: "User" },

    reason: {
      type: String,
      required: true,
      enum: [
        "spam",
        "fake",
        "inappropriate",
        "misleading",
        "offensive",
        "fraud",
        "copyright",
        "other",
      ],
    },
    description: { type: String, maxlength: 1000 },
    evidence: [{ type: String }],

    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "dismissed"],
      default: "open",
    },

    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    resolution: { type: String },
    resolutionNote: { type: String },

    actionTaken: {
      type: String,
      enum: [
        "none",
        "warning_issued",
        "content_removed",
        "user_suspended",
        "user_banned",
        "event_removed",
      ],
    },
  },
  { timestamps: true },
);

ReportSchema.index({ entityType: 1, entityId: 1 });
ReportSchema.index({ status: 1, createdAt: 1 });
ReportSchema.index({ reportedBy: 1 });
ReportSchema.index({ reportedUser: 1 });

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
