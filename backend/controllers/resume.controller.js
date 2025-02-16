import dotenv from 'dotenv';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { Resume } from '../models/resume.model.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

dotenv.config({});

// todo : api key not coming from dotenv
const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
const model = genAI.getGenerativeModel({
  model: 'tunedModels/skill-set-model-v2-ats-friendly--mo9npvn',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: 'You are an AI ATS friendly summarizer which gives ATS friendly summary for resume in 200-300 words based on Skills, Experience and projects provided.',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: "Please provide me with the Skills, Experience, and Projects you want me to analyze. I need this information to generate an ATS-friendly resume summary. \n\n**Here's what I'll need from you:**\n\n* **Skills:** List your technical skills, soft skills, programming languages, frameworks, tools, etc.\n* **Experience:** Describe your work history, including company names, job titles, dates of employment, and key responsibilities. \n* **Projects:** Detail any personal or academic projects, highlighting the technologies used, your contributions, and achievements.\n\nOnce you share this information, I'll craft a 300-400 word ATS-friendly summary that showcases your strengths, experience, and success across Skills, Experience, and Projects. \n\n**Let's optimize your resume for success!** \n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  return result;
}

export const generateSummary = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await run(prompt);
    // console.log(result.response.text());

    return res.status(201).json({
      message: 'Summary created successfully.',
      data: result.response,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating response', error });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { userId } = req.body;
    // const userId = req.id;
    const file = req.file;
    const skills = JSON.parse(req.body.skills);
    const projects = JSON.parse(req.body.projects);
    const experience = JSON.parse(req.body.experience);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const existingResume = await Resume.findOne({ userId });

    let resumeUri = existingResume?.resumeUri || null;
    let pid = existingResume?.publicId || null;
    let publicId;

    if (file) {
      if (pid) {
        await cloudinary.uploader.destroy(pid, { resource_type: 'raw' });
      }

      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: 'raw',
        public_id: `${userId}_${Date.now()}.pdf`,
        format: 'pdf',
      });
      resumeUri = cloudResponse.secure_url;
      publicId = cloudResponse.public_id;
    }

    const updatedData = {
      userId,
      skills,
      projects,
      experience,
      resumeUri,
      publicId,
    };

    const resume = await Resume.findOneAndUpdate({ userId }, updatedData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return res.status(200).json({
      message: 'Resume uploaded successfully.',
      data: resume,
      success: true,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ message: 'Error uploading resume', error });
  }
};
