const express = require("express");

const {
  listTenders,
  getTender,
  createTender,
  updateTender,
  deleteTender,
} = require("../controllers/tenderController");

const router = express.Router();

router.get("/", listTenders);
router.get("/:id", getTender);
router.post("/", createTender);
router.patch("/:id", updateTender);
router.delete("/:id", deleteTender);

module.exports = router;
