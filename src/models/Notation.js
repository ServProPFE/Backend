const mongoose = require("mongoose");

const notationSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Notation = mongoose.model("Notation", notationSchema);

module.exports = { Notation };
