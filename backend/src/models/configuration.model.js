const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      index: true,
    },
    contractTarget: {
      type: Number,
      required: true,
      default: 0,
    },
    effectiveFrom: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

configurationSchema.index({ year: 1, effectiveFrom: -1 });

const Configuration = mongoose.model("Configuration", configurationSchema);

module.exports = Configuration;
