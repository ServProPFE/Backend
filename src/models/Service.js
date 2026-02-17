const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "PLOMBERIE",
        "ELECTRICITE",
        "CLIMATISATION",
        "NETTOYAGE",
        "AUTRE",
      ],
      required: true,
    },
    priceMin: { type: Number, required: true },
    duration: { type: Number, required: true },
    currency: { type: String, default: "TND" },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = { Service };
