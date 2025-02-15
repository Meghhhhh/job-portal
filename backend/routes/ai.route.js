import express from "express";
import { getIntvQues } from "../controllers/ai.controller.js"; 
import { chatbot } from "../controllers/ai.controller.js";

const router = express.Router();
router.route("/mock-intv").post(getIntvQues);
router.route("/chatbot").post(chatbot);

export default router;
