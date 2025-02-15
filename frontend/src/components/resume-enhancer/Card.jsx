import React, { useState } from "react";

const Card = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <div className="max-w-md mx-auto bg-card shadow-lg rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold text-primary mb-4">Upload Resume & Job Details</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full border border-input p-2 rounded-md bg-background text-foreground focus:ring focus:ring-primary"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full border border-input p-2 rounded-md bg-background text-foreground focus:ring focus:ring-primary"
          placeholder="Enter job title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">Job Description</label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full border border-input p-2 rounded-md bg-background text-foreground focus:ring focus:ring-primary"
          placeholder="Enter job description"
          rows="3"
        />
      </div>
      <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-opacity-90">
        Submit
      </button>
    </div>
  );
};

export default Card;
