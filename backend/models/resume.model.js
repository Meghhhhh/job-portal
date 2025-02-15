const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  fileUrl: { type: String, default: null },
  parsedText: { type: String, required: true }, 
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);
