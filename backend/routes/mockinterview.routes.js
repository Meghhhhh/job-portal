import express from "express";
import multer from "multer";
import { uploadVideo } from "../controllers/mockinterview.controller.js";

const router = express.Router();

// Configure Multer
const storage = multer.memoryStorage(); // Use memory storage to work with getDataUri
const upload = multer({ storage });

router.post("/upload-video", upload.single("video"), uploadVideo);

export default router;
