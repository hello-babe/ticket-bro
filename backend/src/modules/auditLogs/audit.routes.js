"use strict";

const express = require("express");
const router = express.Router();

// Placeholder routes - implement controllers later
router.get("/", (req, res) => res.json({ message: "Audit logs endpoint" }));

module.exports = router;
