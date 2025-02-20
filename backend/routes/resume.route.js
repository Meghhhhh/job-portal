import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  generateSummary,
  getAllProjects,
  getAllSkills,
  updateResume,
  uploadResume,
} from "../controllers/resume.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/generateSummary").post(generateSummary);
router
  .route("/upload-resume")
  .post(isAuthenticated, singleUpload, uploadResume);
router.route("/update-extract").post(isAuthenticated, updateResume);
router.route("/getSkills").get(isAuthenticated, getAllSkills);
router.route("/getProjects").get(isAuthenticated, getAllProjects);

export default router;
