import express from "express";
import {generateSummary, uploadResume} from "../controllers/resume.controller.js"
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route('/generateSummary').post(generateSummary);
router.route('/upload-resume').post(singleUpload, uploadResume);

export default router;
