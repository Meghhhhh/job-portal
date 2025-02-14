import express from "express";
import { getIntvQues } from "../controllers/ai.controller.js";  // Add `.js`

const router = express.Router();
router.route("/mock-intv").post(getIntvQues);

export default router;
