const express = require("express");
const { getUsdToIdrRate } = require("../controllers/rates.controller");

const router = express.Router();

router.get("/usd-idr", getUsdToIdrRate);

module.exports = router;

