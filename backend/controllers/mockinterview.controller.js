import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { run } from "../geminiApi.js";

export const uploadVideo = async (req, res) => {
    try {
        console.log("entered");
        const file = req.file;
        console.log(file);
        if (!file) {
            return res.status(400).json({
                message: "No video file provided.",
                success: false
            });
        }

        const fileUri = getDataUri(file);

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "video"
        });

        const videoUrl = cloudResponse.secure_url;
        const publicId = cloudResponse.public_id; // Get the public ID for deletion

        // Run your AI process
        const response = await run(videoUrl);
        console.log(response);

        // Delete video from Cloudinary after processing
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

        return res.status(200).json({
            message: "Video uploaded, processed, and deleted successfully.",
            success: true,
           
            response
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
