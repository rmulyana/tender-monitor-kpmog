const Configuration = require("../models/configuration.model");

const buildDistributedTargets = (annualTarget) => {
  const target = Number(annualTarget) || 0;
  const q1 = 0;
  const q2 = target * 0.25;
  const q3 = target * 0.5;
  const q4 = target * 0.75;
  return [q1, q1, q1, q2, q2, q2, q3, q3, q3, q4, q4, target];
};

const pickActiveConfig = async (year) => {
  const active = await Configuration.findOne({ year, isActive: true }).sort({
    effectiveFrom: -1,
    updatedAt: -1,
  });
  if (active) return active;
  return Configuration.findOne({ year }).sort({
    effectiveFrom: -1,
    updatedAt: -1,
  });
};

const getTargetByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const numericYear = Number(year);
    const config = await pickActiveConfig(numericYear);

    if (!config) {
      // Return a default or indicate not found
      return res.status(200).json({
        year: numericYear,
        contractTarget: null,
        monthlyTargets: [],
        isActive: false,
      });
    }

    const monthlyTargets = buildDistributedTargets(config.contractTarget);
    res.status(200).json({
      ...config.toObject(),
      monthlyTargets,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching configuration", error: error.message });
  }
};

const setTargetByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const { contractTarget, effectiveFrom } = req.body;

    if (contractTarget === undefined) {
      return res.status(400).json({ message: "contractTarget is required" });
    }

    const numericYear = Number(year);
    const parsedTarget = Number(contractTarget);
    const parsedEffectiveFrom = effectiveFrom ? new Date(effectiveFrom) : new Date();

    // Deactivate previous active configs for the same year to preserve history.
    await Configuration.updateMany({ year: numericYear, isActive: true }, { isActive: false });

    const createdConfig = await Configuration.create({
      year: numericYear,
      contractTarget: parsedTarget,
      effectiveFrom: parsedEffectiveFrom,
      isActive: true,
    });

    res.status(201).json({
      ...createdConfig.toObject(),
      monthlyTargets: buildDistributedTargets(createdConfig.contractTarget),
    });
  } catch (error) {
    res.status(500).json({ message: "Error setting configuration", error: error.message });
  }
};

const getTargetHistoryByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const numericYear = Number(year);
    const configs = await Configuration.find({ year: numericYear })
      .sort({ effectiveFrom: -1, updatedAt: -1 })
      .lean();

    const history = configs.map((config) => ({
      ...config,
      monthlyTargets: buildDistributedTargets(config.contractTarget),
    }));

    res.status(200).json({
      year: numericYear,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching configuration history", error: error.message });
  }
};

module.exports = {
  getTargetByYear,
  setTargetByYear,
  getTargetHistoryByYear,
};
