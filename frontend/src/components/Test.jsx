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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 w-[50%]">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-4">Question {currentQuestion + 1}</h2>
        <p className="mb-4">
          {questionList[currentQuestion]?.question ||
            "Please provide the input you would like me to base the questions on."}
        </p>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={answers[currentQuestion]}
          onChange={handleChange}
          placeholder="Type your answer here..."
        ></textarea>
        <div className="flex justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ${
              currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          {currentQuestion === questionList.length - 1 ? (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
