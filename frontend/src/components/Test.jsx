import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TestPage = ({ questions = [], transcribedText }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure questions is an array
  const questionList = Array.isArray(questions) ? questions : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questionList.length).fill(""));

  // Prepopulate the answer for the current question with transcribedText
  useEffect(() => {
    if (transcribedText && currentQuestion === 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = transcribedText;
      setAnswers(newAnswers);
    }
  }, [transcribedText, currentQuestion]);

  const handleNext = () => {
    if (currentQuestion < questionList.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const formattedAnswers = answers.map((answer, index) => ({
      answer_id: index + 1,
      answer: answer,
    }));
    
    try {
      const stringans = JSON.stringify(formattedAnswers);
      const response = await fetch("http://localhost:8000/api/v1/ai/mock-intv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: stringans }),
      });

      const result = await response.json();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }

    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen border-x-lime-200 text-black p-6 w-[100%]">
      <div className="bg-white border border-purple-500 p-6 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Question {currentQuestion + 1}</h2>
        <p className="mb-4 text-black font-medium">
          {questionList[currentQuestion]?.question || "Please provide the input you would like me to base the questions on."}
        </p>
        <textarea
          className="w-full p-3 rounded-lg border border-purple-500 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          value={answers[currentQuestion]}
          onChange={handleChange}
          placeholder="Type your answer here..."
        ></textarea>
        <div className="flex justify-between">
          <button
            className={`bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out ${
              currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          {currentQuestion === questionList.length - 1 ? (
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
