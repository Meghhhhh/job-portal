import {run} from "../utils/geminiIntv.js";  
import {runchat} from "../utils/chatbot.js";

export const getIntvQues = async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await run(prompt);
        console.log("ress",result);
        // Convert string to JSON object
        const parsedResult = JSON.parse(result);
        res.json({ result: parsedResult }); 
    } catch (error) {
        console.error("Error parsing JSON:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const chatbot = async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await runchat(prompt);
        console.log("ressss",result);
        res.json({ result: result }); 
    } catch (error) {
        console.error("Error parsing JSON:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

