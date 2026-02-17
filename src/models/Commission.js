const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    percentage: { type: Number, required: true },
    amount: { type: Number },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  },
  { timestamps: true }
);

const Commission = mongoose.model("Commission", commissionSchema);

module.exports = { Commission };
