const mongoose = require("mongoose");

const Tender = require("../models/Tender");

const mapIncomingPayload = (payload) => {
  const next = { ...payload };
  if (next.id && !next.pin) {
    next.pin = String(next.id);
  }
  delete next.id;
  delete next.tenderId;
  return next;
};

const buildFindFilter = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    const byObjectId = await Tender.findById(id);
    if (byObjectId) return { _id: id };
  }
  return { pin: id };
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
    const now = new Date();
    if (!payload.statusChangedAt) {
      payload.statusChangedAt = now;
    }
    if (payload.status === "Failed") {
      payload.isFailed = true;
      if (!payload.failedAt) {
        payload.failedAt = now;
      }
      if (!payload.outcomeStatus) {
        payload.outcomeStatus = "Lost";
      }
    }
    if (payload.stage === "Contract") {
      if (!payload.contractAt) {
        payload.contractAt = now;
      }
      if (!payload.outcomeStatus) {
        payload.outcomeStatus = payload.status === "Signed" ? "Won" : "Open";
      }
    }
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
    const existing = await Tender.findOne(filter);
    if (!existing) {
      return res.status(404).json({ error: "Tender not found" });
    }

    const now = new Date();
    const hasStatus = Object.prototype.hasOwnProperty.call(payload, "status");
    const hasStage = Object.prototype.hasOwnProperty.call(payload, "stage");
    if (hasStatus && payload.status !== existing.status) {
      payload.statusChangedAt = now;
      if (payload.status === "Failed") {
        payload.isFailed = true;
        payload.failedAt = now;
        payload.outcomeStatus = payload.outcomeStatus || "Lost";
      } else if (existing.status === "Failed") {
        payload.failedAt = null;
        payload.isFailed = false;
        if (!payload.outcomeStatus) {
          payload.outcomeStatus = existing.outcomeStatus || "Open";
        }
      }
      if (payload.status === "Signed" && !payload.outcomeStatus) {
        payload.outcomeStatus = "Won";
      }
    }
    if (hasStage && payload.stage !== existing.stage) {
      if (payload.stage === "Contract") {
        payload.contractAt = now;
        if (!payload.outcomeStatus) {
          payload.outcomeStatus = payload.status === "Signed" ? "Won" : "Open";
        }
      } else if (existing.stage === "Contract") {
        payload.contractAt = null;
        if (!payload.outcomeStatus) {
          payload.outcomeStatus = "Open";
        }
      }
    }

    if (payload.isFailed === true && !payload.outcomeStatus) {
      payload.outcomeStatus = "Lost";
    }
    if (payload.isFailed === false && !payload.outcomeStatus) {
      payload.outcomeStatus = "Open";
    }
    const tender = await Tender.findOneAndUpdate(filter, payload, {
      new: true,
      runValidators: true,
    });
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
