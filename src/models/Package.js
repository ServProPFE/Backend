const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    months: { type: Number, required: true },
    numberVisits: { type: Number, required: true },
    monthlyPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = { Package };
