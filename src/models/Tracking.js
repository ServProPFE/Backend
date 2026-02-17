const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    position: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Tracking = mongoose.model("Tracking", trackingSchema);

module.exports = { Tracking };
