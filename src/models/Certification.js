const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    authority: { type: String },
    expiresAt: { type: Date },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Certification = mongoose.model("Certification", certificationSchema);

module.exports = { Certification };
