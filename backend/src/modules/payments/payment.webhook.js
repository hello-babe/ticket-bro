"use strict";

const express = require("express");
const router = express.Router();

// Placeholder routes - implement controllers later
router.post("/stripe", (req, res) => res.json({ message: "Stripe webhook" }));

module.exports = router;
