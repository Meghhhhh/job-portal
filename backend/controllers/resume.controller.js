import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { Resume } from "../models/resume.model.js";
import { User } from "../models/user.model.js";

dotenv.config({});

// todo : api key not coming from dotenv
const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
const model = genAI.getGenerativeModel({
  model: "tunedModels/skill-set-model-v2-ats-friendly--mo9npvn",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "You are an AI ATS friendly summarizer which gives ATS friendly summary for resume in exact 20 words based on Skills, Experience and projects provided.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Please provide me with the Skills, Experience, and Projects you want me to analyze. I need this information to generate an ATS-friendly resume summary. \n\n**Here's what I'll need from you:**\n\n* **Skills:** List your technical skills, soft skills, programming languages, frameworks, tools, etc.\n* **Experience:** Describe your work history, including company names, job titles, dates of employment, and key responsibilities. \n* **Projects:** Detail any personal or academic projects, highlighting the technologies used, your contributions, and achievements.\n\nOnce you share this information, I'll craft an exact 20 word ATS-friendly summary that showcases your strengths, experience, and success across Skills, Experience, and Projects. \n\n**Let's optimize your resume for success!** \n",
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
      message: "Summary created successfully.",
      data: result.response,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error generating response", error });
  }
};

export const uploadResume = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.id;
    const skills = JSON.parse(req.body.skills);
    const projects = JSON.parse(req.body.projects);
    const experience = JSON.parse(req.body.experience);
    const summary = JSON.parse(req.body.summary);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const updatedData = {
      userId,
      skills,
      projects,
      summary,
      experience,
    };

    const resume = await Resume.findOneAndUpdate({ userId }, updatedData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "profile.skills": skills,
          "profile.bio": summary,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Resume saved successfully.",
      data: resume,
      user,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({ message: "Error uploading resume", error });
  }
};

export const updateResume = async (req, res) => {
  const { skills, projects, summary, experience, education } = req.body;
  const userId = req.id;
  console.log(req.body);

  // Validate if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  try {
    // Format the data to match the schema
    const formattedSkills = skills
      ? skills.map((skill) => ({
          name: skill.name,
          level: [0, 1, 2, 3].includes(skill.level) ? skill.level : 0,
        }))
      : [];

    const formattedProjects = projects
      ? projects.map((project) => ({
          name: project.name,
          description: project.description,
          isVerified: project.isVerified || false,
        }))
      : [];

    const formattedExperience = experience || [];

    const formattedEducation = education
      ? education.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          gpa: edu.gpa || "",
          honors: edu.honors || "",
        }))
      : [];

    // Check if the resume exists
    let resume = await Resume.findOne({ userId });

    if (resume) {
      // Update the existing resume
      resume.skills = formattedSkills;
      resume.projects = formattedProjects;
      resume.summary = summary;
      resume.experience = formattedExperience;
      resume.education = formattedEducation;

      // Save updated resume
      await resume.save();
      return res
        .status(200)
        .json({ message: "Resume updated successfully!", resume });
    } else {
      // Create a new resume if none exists
      resume = new Resume({
        userId,
        skills: formattedSkills,
        projects: formattedProjects,
        summary,
        experience: formattedExperience,
        education: formattedEducation,
      });

      // Save new resume
      await resume.save();
      return res
        .status(201)
        .json({ message: "Resume created successfully!", resume });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating the resume." });
  }
};
