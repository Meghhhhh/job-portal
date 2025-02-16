import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import CameraScreen from "./CameraScreen";

const MockDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-slate-200 w-full h-screen flex flex-col items-center justify-center p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Take Your Mock Interview</h1>
          <p className="text-lg text-gray-600 mt-2">
            Upload your resume and get AI-generated interview questions.
          </p>
        </div>

        <CameraScreen />
      </div>
      <Footer />
    </div>
  );
};

export default MockDashboard;
