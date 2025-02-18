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
});

export const Resume = mongoose.model('Resume', resumeSchema);