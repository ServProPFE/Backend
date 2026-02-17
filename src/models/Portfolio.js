const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = { Portfolio };
