const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    total: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = { Invoice };
