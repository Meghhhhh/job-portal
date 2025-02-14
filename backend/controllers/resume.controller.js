import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({});

// todo : api key not coming from dotenv
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: 'tunedModels/skill-set-model-v2-ats-friendly--mo9npvn',
});

export const generateSummary = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

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
