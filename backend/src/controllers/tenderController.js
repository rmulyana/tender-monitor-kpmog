const mongoose = require("mongoose");

const Tender = require("../models/Tender");

const mapIncomingPayload = (payload) => {
  const next = { ...payload };
  if (next.id && !next.tenderId) {
    next.tenderId = String(next.id);
  }
  delete next.id;
  return next;
};

const buildFindFilter = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    const byObjectId = await Tender.findById(id);
    if (byObjectId) return { _id: id };
  }
  return { tenderId: id };
};

const listTenders = async (req, res, next) => {
  try {
    const tenders = await Tender.find().sort({ createdAt: -1 });
    res.json(tenders);
  } catch (error) {
    next(error);
  }
};

const getTender = async (req, res, next) => {
  try {
    const filter = await buildFindFilter(req.params.id);
    const tender = await Tender.findOne(filter);
    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

const createTender = async (req, res, next) => {
  try {
    const payload = mapIncomingPayload(req.body || {});
    const tender = await Tender.create(payload);
    res.status(201).json(tender);
  } catch (error) {
    next(error);
  }
};

const updateTender = async (req, res, next) => {
  try {
    const payload = mapIncomingPayload(req.body || {});
    const filter = await buildFindFilter(req.params.id);
    const tender = await Tender.findOneAndUpdate(filter, payload, {
      new: true,
      runValidators: true,
    });
    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

const deleteTender = async (req, res, next) => {
  try {
    const filter = await buildFindFilter(req.params.id);
    const tender = await Tender.findOneAndDelete(filter);
    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }
    res.json({ status: "deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTenders,
  getTender,
  createTender,
  updateTender,
  deleteTender,
};
