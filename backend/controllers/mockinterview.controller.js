 import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
 import { PythonShell } from "python-shell";

// export const uploadVideo = async (req, res) => {
//     try {
//         console.log("Entered uploadVideo controller");

//         const file = req.file;
//         if (!file) {
//             return res.status(400).json({ message: "No video file provided.", success: false });
//         }

//         const fileUri = getDataUri(file);

//         // Upload video to Cloudinary
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "video" });

//         const videoUrl = cloudResponse.secure_url;
//         console.log("Uploaded video to Cloudinary:", videoUrl);

//         // Run proctoring analysis with Python
//         let options = {
//             mode: "json", // Expect JSON output
//             pythonOptions: ["-u"],
//             scriptPath: "./", // Path where proctoring.py is stored
//             args: [videoUrl] // Send Cloudinary video URL to Python script
//         };
//         console.log("Calling Python script with video URL:", videoUrl);

//         PythonShell.run("proctoring.py", options, (err, results) => {
//             if (err) {
//                 console.error("Error running Python script:", err);
//                 return res.status(500).json({ message: "Python script error", success: false, error: err.message });
//             }

//             console.log("Proctoring results:", results);

//             // Ensure results are properly parsed
//             if (results && results.length > 0) {
//                 return res.status(200).json({ success: true, results: results[0] });
//             } else {
//                 return res.status(500).json({ success: false, message: "Invalid response from Python script" });
//             }
//         });

//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ message: "Failed to process video.", success: false, error: error.message });
//     }
// };


export const uploadVideo = async (req, res) => {
    try {
        console.log("Entered uploadVideo controller");

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No video file provided.", success: false });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "video" });
        const videoUrl = cloudResponse.secure_url;
        console.log("Uploaded video to Cloudinary:", videoUrl);

        let options = {
            mode: "json", // Expect JSON output from Python
            pythonOptions: ["-u"],
            scriptPath: "./", // Adjust if necessary
            args: [videoUrl]
        };

        console.log("Calling Python script with video URL:", videoUrl);

        let shell = new PythonShell("proctoring.py", options);

        let resultData = null;

        shell.on("message", (message) => {
            console.log("Python Output:", message);
            resultData = message; // Store parsed JSON response
        });

        shell.on("error", (error) => {
            console.error("PythonShell Error:", error);
            return res.status(500).json({ message: "Python script error", success: false, error: error.message });
        });

        shell.end((err, code, signal) => {
            if (err) {
                console.error("Error running Python script:", err);
                return res.status(500).json({ message: "Python script error", success: false, error: err.message });
            }

            console.log(`Python script finished with exit code ${code}, signal: ${signal}`);
const response = resultData;
            return res.status(200).json({
                message: "Video uploaded, processed, and deleted successfully.",
                success: true,
                response
            });
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Failed to upload or process video.",
            success: false,
            error: error.message
        });
    }
};

