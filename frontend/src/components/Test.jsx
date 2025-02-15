import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure questions is an array
  const questionList = location.state?.questions?.result || location.state?.questions || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questionList.length).fill(""));

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

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6 w-[50%]">
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
