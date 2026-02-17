const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    validUntil: { type: Date },
    active: { type: Boolean, default: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

module.exports = { Offer };
