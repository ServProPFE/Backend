const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = { Availability };
