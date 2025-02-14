import express from "express";
import {generateSummary} from "../controllers/resume.controller.js"

const router = express.Router();

router.post('/generateSummary', generateSummary);

export default router;
