"use strict";

const express = require("express");
const router = express.Router();

// Placeholder routes - implement controllers later
router.get("/", (req, res) => res.json({ message: "Categories endpoint" }));
router.get("/:slug", (req, res) => res.json({ message: "Category by slug" }));

module.exports = router;
