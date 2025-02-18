import React, { useState } from "react";
import axios from "axios";
import { PYTHON_API_END_POINT } from "@/utils/constant";

const ResumeParser = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [atsFile, setAtsFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [atsData, setAtsData] = useState(null);

  const handleFileChange = (event, setFile) => {
    setFile(event.target.files[0]);
  };

  const handleSubmitResume = async (event) => {
    event.preventDefault();
    if (!resumeFile) return alert("Please upload a PDF resume.");

    const formData = new FormData();
    formData.append("pdf_doc", resumeFile);

    try {
      const response = await axios.post(
        `${PYTHON_API_END_POINT}/process`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResumeData(response.data);
    } catch (error) {
      console.error("Error processing resume:", error);
      alert("Error processing resume.");
    }
  };

  const handleSubmitATS = async (event) => {
    event.preventDefault();
    if (!atsFile || !jobDescription)
      return alert("Upload a PDF and enter Job Description.");

    const formData = new FormData();
    formData.append("pdf_doc", atsFile);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        `${PYTHON_API_END_POINT}/ats`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAtsData(response.data);
    } catch (error) {
      console.error("Error in ATS Evaluation:", error);
      alert("Error in ATS Evaluation.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
        AI-Powered Resume Parser
      </h1>

      {/* Resume Upload Section */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-blue-300">Upload Resume</h2>
        <form onSubmit={handleSubmitResume} className="mt-4">
          <input
            type="file"
            accept=".pdf"
            className="block w-full text-sm text-gray-300 border border-blue-500 rounded-lg cursor-pointer bg-gray-700 focus:outline-none"
            onChange={(e) => handleFileChange(e, setResumeFile)}
          />
          <p className="text-gray-400 text-xs mt-2">
            {resumeFile ? resumeFile.name : "No file chosen"}
          </p>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition duration-300 py-2 rounded-lg font-semibold"
          >
            Process Resume
          </button>
        </form>
      </div>

      {/* ATS Evaluation Section */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold text-blue-300">ATS Evaluation</h2>
        <form onSubmit={handleSubmitATS}>
          <textarea
            rows="4"
            className="w-full mt-2 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-blue-500"
            placeholder="Paste the Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
          <input
            type="file"
            accept=".pdf"
            className="block w-full text-sm text-gray-300 border border-blue-500 rounded-lg cursor-pointer bg-gray-700 focus:outline-none mt-2"
            onChange={(e) => handleFileChange(e, setAtsFile)}
          />
          <p className="text-gray-400 text-xs mt-2">
            {atsFile ? atsFile.name : "No file chosen"}
          </p>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition duration-300 py-2 rounded-lg font-semibold"
          >
            Evaluate with ATS
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold text-blue-300">Results</h2>
        <div className="border border-white p-4 mt-4 rounded-lg">
          {resumeData && (
            <div>
              <h3 className="text-md font-semibold text-blue-400">
                Resume Data:
              </h3>
              {Object.keys(resumeData).map((key) => (
                <p key={key} className="text-sm text-gray-300">
                  <strong>{key}:</strong> {JSON.stringify(resumeData[key])}
                </p>
              ))}
            </div>
          )}
          {atsData && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-blue-400">
                ATS Evaluation:
              </h3>
              {Object.keys(atsData).map((key) => (
                <p key={key} className="text-sm text-gray-300">
                  <strong>{key}:</strong> {JSON.stringify(atsData[key])}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeParser;
