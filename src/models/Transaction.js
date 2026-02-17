const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "TND" },
    method: {
      type: String,
      enum: ["CARD", "KNET", "APPLE_PAY", "GOOGLE_PAY", "PAYPAL", "CASH"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    provider: { type: String, default: "STRIPE" },
    externalId: { type: String },
    fees: { type: Number, default: 0 },
    commission: { type: mongoose.Schema.Types.ObjectId, ref: "Commission" },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Transaction };
