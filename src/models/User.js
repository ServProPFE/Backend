const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CLIENT", "PROVIDER", "ADMIN"],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    providerProfile: {
      companyName: { type: String },
      license: { type: String },
      insurance: { type: String },
      experienceYears: { type: Number, default: 0 },
      serviceRadius: { type: Number, default: 0 },
      verificationStatus: {
        type: String,
        enum: ["PENDING", "VERIFIED", "REJECTED"],
        default: "PENDING",
      },
      portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }],
      competences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competence" }],
      availability: [{ type: mongoose.Schema.Types.ObjectId, ref: "Availability" }],
      certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certification" }],
    },
    notation: { type: mongoose.Schema.Types.ObjectId, ref: "Notation" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
