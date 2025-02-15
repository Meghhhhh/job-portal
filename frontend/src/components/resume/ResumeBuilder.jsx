import React, { useState, useRef } from 'react';
import FormSection from './FormSection';
import Preview from './Preview';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { RESUME_API_END_POINT } from '@/utils/constant';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const contentRef = useRef(null);
  const reactToPrintFn1 = useReactToPrint({
    contentRef,
    documentTitle: 'Resume',
    onBeforePrint: async () => {
      try {
        setIsUploading(true);

        // Convert the printed content to a Blob
        const pdfBlob = await fetch(downloadUrl).then(res => res.blob());
        const pdfFile = new File([pdfBlob], 'resume.pdf', {
          type: 'application/pdf',
        });

        // Prepare form data
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('userId', "67a45d00ea8ba10b10da7ae2");
        formData.append('skills', JSON.stringify(resumeData.skills || []));
        formData.append('projects', JSON.stringify(resumeData.projects || []));
        formData.append(
          'experience',
          JSON.stringify(JSON.stringify(
            resumeData.experience?.map(exp => exp.role) || []
          ) || []),
        );

        // Send the request to your backend
        const response = await axios.post(
          `${RESUME_API_END_POINT}/upload-resume`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          },
        );

        if (response.data.success) {
          console.log('Resume uploaded successfully:', response.data);
          setDownloadUrl(response.data.data.resumeUri);
        } else {
          console.error('Failed to upload resume.');
        }
      } catch (error) {
        console.error('Error uploading resume:', error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  // const reactToPrintFn = useReactToPrint({ contentRef });
  const handleGenerateAndUpload = () => {
    reactToPrintFn1();
  };

  // const handleDownload = async () => {
  //   // todo : make API call for AI gen of subm
  //   // if (!resumeData.summary || resumeData.summary.trim() === '') {
  //   //   try {
  //   //     const response = await axios.post(
  //   //       `${RESUME_API_END_POINT}/generateSummary`,
  //   //       { prompt: 'Generate a summary based on user details.' }
  //   //     );

  //   //     if (response.status === 200 && response.data.summary) {
  //   //       updatedData = { ...resumeData, summary: response.data };
  //   //       setResumeData(updatedData); // Update state to reflect the summary
  //   //     } else {
  //   //       console.error('Failed to generate summary');
  //   //     }
  //   //   } catch (error) {
  //   //     console.error('Error generating summary:', error);
  //   //   }
  //   // }

  //   // reactToPrintFn();
  // };

  return (
    <div className="container mx-auto p-6 flex gap-6">
      {/* Left: Form */}
      <div className="w-1/2 bg-white border-2 p-4 rounded-lg shadow-md overflow-y-scroll">
        <h2 className="font-bold border-b pb-1 text-center text-xl">Form</h2>
        <FormSection onUpdate={setResumeData} />
      </div>

      {/* Right: Preview (Fixed) */}
      <div className="w-1/2 border-2 bg-white p-4 rounded-lg shadow-md h-screen sticky top-0 overflow-y-auto">
        {/* Wrap Preview in ref */}
        <h2 className="font-bold border-b pb-1 text-center text-xl">Preview</h2>
        <div ref={contentRef}>
          {Object.keys(resumeData).length ? (
            <Preview data={resumeData} />
          ) : (
            <p className="text-gray-500 text-center py-10">
              Fill out the form to see the preview
            </p>
          )}
        </div>

        {/* PDF Download Button (Only shows when data exists) */}
        <button
          onClick={handleGenerateAndUpload}
          className={`mt-4 w-full py-2 rounded-md transition ${
            Object.keys(resumeData).length
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={!Object.keys(resumeData).length || isUploading}
        >
          {isUploading ? 'Please wait...' : 'Generate PDF'}
        </button>
      </div>
    </div>
  );
};

export default ResumeBuilder;
