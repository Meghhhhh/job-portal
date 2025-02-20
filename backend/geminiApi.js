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
    systemInstruction: `"You are an AI-powered interview monitoring system designed to detect cheating behaviors during an interview.

Monitoring Criteria:
1️⃣ Head Movement Detection:
 If the candidates face is still and its not moving then give 5/5 score
If the candidate face turns to the left or right, issue a fair warning and reduce the score.


2️⃣ Hand Movement Detection:

Excessive hand movements (gesturing too much, waving, or covering the face) should also trigger warnings.
Warning System:
Provide gentle warnings if minor distractions occur.

Final Feedback Format
If the users face is still and no movemets, then dont lower the score
If head and hand movements are detcted, then lower the score and issue precise warnings.
At the end of the interview, provide a structured report with a striing in this format onlly where score shiuld be given out of 100 and warnings u fill the string with different warnings and feedback pls dont so any other format response should consist the string from curly brackets only dont write anything else in the output like ok i have done this n that
{"Score":"",
"Warnings" :"",
"Feedback":""}

Maintain a neutral and professional tone while ensuring fairness in evaluation.


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
            generationConfig,
            history: [
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen with no head movements and hand movements\""},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"5/5\",\n\"Warnings\" :\"No warnings issued.\",\n\"Feedback\":\"The candidate maintained excellent focus and demonstrated no signs of distraction or suspicious behavior.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen with slight head movement but no hand movement"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"4/5\",\n\"Warnings\" :\"Slight head movement detected. Please maintain focus on the screen.\",\n\"Feedback\":\"The candidate mostly maintained focus. A slight head movement was observed, but it was not excessive. Please be mindful of minimizing distractions.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen with no head movement but slight hand movement\""},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"4/5\",\n\"Warnings\" :\"Minor hand movement detected. Please avoid unnecessary hand gestures.\",\n\"Feedback\":\"The candidate mostly maintained focus. Minor hand movement was observed, but it was not excessive. Please be mindful of minimizing distractions.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen with frequent head movements"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"2/5\",\n\"Warnings\" :\"Frequent head movements detected. Please minimize looking away from the screen. Repeated warnings may affect your evaluation.\",\n\"Feedback\":\"The candidate exhibited frequent head movements, suggesting potential distraction or external resources being consulted. Continued observation is recommended.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen with frequent hand movements"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"2/5\",\n\"Warnings\" :\"Frequent hand movements detected. Please avoid excessive gesturing. Continued excessive hand movements may affect your evaluation.\",\n\"Feedback\":\"The candidate exhibited frequent hand movements, which could be a sign of nervousness or an attempt to conceal something. Continued observation is recommended.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen but another person is detected in the frame"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"1/5\",\n\"Warnings\" :\"Another person detected in the frame. Please ensure you are alone in the room. This is a serious violation of interview protocol.\",\n\"Feedback\":\"The presence of another person in the frame raises significant concerns about the integrity of the interview. Immediate clarification is required.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking away from the screen frequently"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"1/5\",\n\"Warnings\" :\"Candidate is frequently looking away from the screen. This is a serious concern. Please maintain focus on the screen; repeated offenses will not be tolerated.\",\n\"Feedback\":\"The candidate's consistent lack of focus on the screen suggests potential dishonesty or reliance on external resources. This behavior requires immediate attention and further scrutiny.\"}\n"},
                ],
              },
              {
                role: "user",
                parts: [
                  {text: "if the user is looking at the screen but an external object is detected"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "{\"Score\":\"2/5\",\n\"Warnings\" :\"An external object has been detected. Please ensure you are not using unauthorized materials. Remove the object immediately.\",\n\"Feedback\":\"The presence of an external object raises concerns. Its nature and the candidate's interaction with it should be investigated further. Continued observation is crucial.\"}\n"},
                ],
              },
            ],
        
        }
      
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
  

 
 