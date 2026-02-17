const mongoose = require("mongoose");

const competenceSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true },
    level: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "EXPERT"], required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Competence = mongoose.model("Competence", competenceSchema);

module.exports = { Competence };
