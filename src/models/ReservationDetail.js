const mongoose = require("mongoose");

const reservationDetailSchema = new mongoose.Schema(
  {
    description: { type: String },
    address: { type: String, required: true },
    urgent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ReservationDetail = mongoose.model("ReservationDetail", reservationDetailSchema);

module.exports = { ReservationDetail };
