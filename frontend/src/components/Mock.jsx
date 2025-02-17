import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Mock = () => {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState("1");
  const [isProject, setIsProject] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const prefix = isProject ? "Project: " : "Skill: ";
      const custinput = `${prefix}${input} (Level ${level})`;

      const response = await fetch("http://localhost:8000/api/v1/ai/mock-intv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: custinput }),
      });

      const data = await response.json();
      console.log("data", data);
      navigate("/combinedMock", { state: { questions: data } });
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">
          Enter {isProject ? "Project" : "Skill"} Details
        </h2>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isProject"
            className="mr-2 w-5 h-5"
            checked={isProject}
            onChange={() => setIsProject(!isProject)}
          />
          <label htmlFor="isProject" className="text-sm">
            Check if this is a project
          </label>
        </div>
        <input
          type="text"
          placeholder={`Enter ${isProject ? "project" : "skill"} details`}
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <label className="block mb-2">Select Level</label>
        <select
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
        </select>
        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-all"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Mock;
