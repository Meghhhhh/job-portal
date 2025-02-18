import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skills: [
    {
      name: { type: String, required: true },
      level: { type: Number, enum: [0, 1, 2, 3], default: 0, required: true },
    },
  ],
  projects: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      isVerified: {type: Boolean, required: true, default: false}
    },
  ],
  summary: {
    type: String,
    required: true,
  },
  experience: {
    type: [String],
    default: [],
  },
  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      gpa: { type: String, required: false },
      honors: { type: String, required: false },
    },
  ],
});

export const Resume = mongoose.model('Resume', resumeSchema);
