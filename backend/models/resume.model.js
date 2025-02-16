
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skills: { type: [String], default: [], required: true },
  projects: [
    {
      name: String,
      description: String,
    },
  ],
  experience: { type: [String], default: [] },
  resumeUri: { type: String },
  publicId : { type: String },
});

export const Resume = mongoose.model('Resume', resumeSchema);

