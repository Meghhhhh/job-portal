import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import os from "os";
import axios from "axios";
import fs from "fs";
import path from "path";
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */




  async function uploadToGemini(remoteUrl, mimeType) {
    try {
      console.log(`Downloading file from: ${remoteUrl}`);
  
      // Generate a temporary file path
      const tempFilePath = path.join("/tmp", `temp_${Date.now()}.mp4`);
  
      // Download the file
      const response = await axios({
        method: "get",
        url: remoteUrl,
        responseType: "arraybuffer",
      });
  
      // Save it locally
      fs.writeFileSync(tempFilePath, response.data);
      console.log(`File saved locally at: ${tempFilePath}`);
  
      // Upload to Gemini
      const uploadResult = await fileManager.uploadFile(tempFilePath, {
        mimeType,
        displayName: path.basename(tempFilePath),
      });
  
      // Clean up the local file after upload
      fs.unlinkSync(tempFilePath);
  
      console.log(`Uploaded file as: ${uploadResult.file.name}`);
      return uploadResult.file;
    } catch (error) {
      console.error("Error uploading to Gemini:", error);
      throw error;
    }
  }
  
  /**
   * Waits for the given files to be active.
   *
   * Some files uploaded to the Gemini API need to be processed before they can
   * be used as prompt inputs. The status can be seen by querying the file's
   * "state" field.
   *
   * This implementation uses a simple blocking polling loop. Production code
   * should probably employ a more sophisticated approach.
   */
  async function waitForFilesActive(file) {
    console.log("Waiting for file processing...");
    let uploadedFile = await fileManager.getFile(file.name);
    
    while (uploadedFile.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      uploadedFile = await fileManager.getFile(file.name);
    }
  
    if (uploadedFile.state !== "ACTIVE") {
      throw Error(`File ${uploadedFile.name} failed to process`);
    }
  
    console.log("\nFile is ready\n");
  }
  
  
   
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are an AI assistant responsible for analyzing user behavior during a recorded interview. Follow these strict evaluation criteria without deviation:

If the user's face remains stable, without noticeable movement to the left or right, and no hand movements are detected throughout the recording, you must assign a score of 5/5. No exceptions.



If user does head movement (frequent left/right turns) or hand gestures (waving, touching face, or adjusting objects) are detected, assign a score acordingly based on how many times the movement occurs 




Do not generate unnecessary warnings or speculative feedback. You must rely solely on detected visual movements.
These rules are absolute. You cannot make excuses, add unnecessary context, or provide subjective reasoning. Follow the above criteria with 100% accuracy.

in warnings write what movements are detcted 
Final Feedback Format:
At the end of the interview, provide a structured report with a striing in this format onlly where score shiuld be given out of 5 and warnings u fill the string with different warnings and feedback pls dont so any other format response should consist the string from curly brackets only dont write anything else in the output like ok i have done this n that
{"Score":"",
"Warnings" :"",
"Feedback":""}

`,
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(fileGiven) {
    console.log(fileGiven)
    const fileFinal = 
        await uploadToGemini(fileGiven, "video/x-matroska");
      console.log(fileGiven,fileFinal)
    
      // Some files have a processing delay. Wait for them to be ready.
      await waitForFilesActive(fileFinal);
    
    const chatSession = model.startChat(
        {
            generationConfig}
      
  );
  
    const result = await chatSession.sendMessage(fileGiven);
    console.log(result.response.text());
    return result.response.text();
   
  }
  
  export { run };




 
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  

 
 