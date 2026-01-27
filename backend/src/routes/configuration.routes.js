const express = require("express");
const {
  getTargetByYear,
  setTargetByYear,
  getTargetHistoryByYear,
} = require("../controllers/configuration.controller");

const router = express.Router();

// Get the active target for a specific year
router.get("/targets/:year", getTargetByYear);

// Get the full target history for a specific year
router.get("/targets/:year/history", getTargetHistoryByYear);

// Create a new target version for a specific year
router.post("/targets/:year", setTargetByYear);

module.exports = router;
