import React, { useState, useRef } from 'react';
import FormSection from './FormSection';
import Navbar from '../shared/Navbar';
import Preview from './Preview';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { RESUME_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);
  const dispatch = useDispatch();

  const reactToPrintFn1 = useReactToPrint({
    contentRef,
    documentTitle: 'Resume',
  });

  const handleAIGenSum = async () => {
    try {
      setIsGenerating(true);
      setResumeData(prev => ({ ...prev, summary: '' }));

      const promptData = {
        skills: resumeData.skills.map(skill => skill.name).join(', '),
        experience: resumeData?.experience
          ?.map(exp => `${exp.role} at ${exp.company} (${exp.duration})`)
          .join(', '),
        projects: resumeData?.projects
          ?.map(proj => `${proj.name}: ${proj.description}`)
          .join(', '),
      };

      const prompt = Object.entries(promptData)
        .filter(([_, value]) => value) // Remove empty fields
        .map(
          ([key, value]) =>
            `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
        )
        .join('. ');

        const response = await axios.post(
          `${RESUME_API_END_POINT}/generateSummary`,
          { prompt },
        );

        console.log(response.data.data.candidates[0].content.parts[0].text);

        if (response.status === 201 && response?.data?.data) {
          setResumeData(prev => ({
            ...prev,
            summary: response.data.data.candidates[0].content.parts[0].text,
          }));
      }
    } catch (error) {
      console.log('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAndUpload = async () => {
    try {
      setIsUploading(true);

      // Prepare form data
      const formData = new FormData();
      formData.append('skills', JSON.stringify(resumeData.skills || []));
      formData.append('projects', JSON.stringify(resumeData.projects || []));
      formData.append('summary', JSON.stringify(resumeData.summary || ''));
      formData.append(
        'experience',
        JSON.stringify(
          JSON.stringify(resumeData.experience?.map(exp => exp.role) || []) ||
            [],
        ),
      );

      // Upload file to backend
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
        dispatch(setUser(response.data.user));
        reactToPrintFn1();
      } else {
        console.error('Failed to upload resume.');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setIsUploading(false);
    }
  };

  //reusme validations

  // Helper function to check if AI summary can be generated
  const canGenerateAISummary = () => {
    return (
      (resumeData.skills ?? []).length > 0 &&
      (resumeData.experience ?? []).some(exp => exp?.role?.trim()) &&
      (resumeData.projects ?? []).some(proj => proj?.name?.trim())
    );
  };

  // Helper function to check if resume is completely filled
  const isResumeComplete = () => {
    return (
      resumeData.name?.trim() &&
      resumeData.email?.trim() &&
      resumeData.mobile?.trim() &&
      resumeData.summary?.trim() &&
      (resumeData.education ?? []).every(
        edu => edu?.institution?.trim() && edu?.degree?.trim(),
      ) &&
      (resumeData.experience ?? []).every(
        exp => exp?.role?.trim() && exp?.company?.trim(),
      ) &&
      (resumeData.projects ?? []).every(
        proj => proj?.name?.trim() && proj?.description?.trim(),
      ) &&
      (resumeData.achievements ?? []).every(
        ach => ach?.title?.trim() && ach?.description?.trim(),
      ) &&
      (resumeData.skills ?? []).length > 0
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 flex gap-6">
        {/* Left: Form */}
        <div className="w-1/2 bg-white border-2 p-4 rounded-lg shadow-md overflow-y-scroll">
          <h2 className="font-bold border-b pb-1 text-center text-xl">Form</h2>
          <FormSection onUpdate={setResumeData} />
        </div>

        {/* Right: Preview (Fixed) */}
        <div className="w-1/2 border-2 bg-white p-4 rounded-lg shadow-md h-screen sticky top-0 overflow-y-auto">
          <h2 className="font-bold border-b pb-1 text-center text-xl">
            Preview
          </h2>
          <div ref={contentRef} className="bg-white">
          {resumeData.name || resumeData.email || resumeData.skills.length > 0 ? (
              <Preview data={resumeData} />
            ) : (
              <p className="text-gray-500 text-center py-10">
                Fill out the form to see the preview
              </p>
            )}
          </div>

          {/* AI generation  */}
          <button
            onClick={handleAIGenSum}
            title='Please fill Skills, Experience & Projects for AI generated summary!'
            className={`mt-4 p-2 rounded-md transition ${
              canGenerateAISummary()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!canGenerateAISummary() || isGenerating}
          >
            {isGenerating ? 'Please wait...' : 'Generate AI summary'}
          </button>

          {/* PDF Download Button */}
          <button
            onClick={handleGenerateAndUpload}
            title='Please fill all the fields to download the pdf!'
            className={`m-4 p-2 rounded-md transition ${
              isResumeComplete()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!isResumeComplete() || isUploading}
          >
            {isUploading ? 'Please wait...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;

// only download from create-resume, 

// import React, { useState, useRef } from 'react';
// import FormSection from './FormSection';
// import Navbar from '../shared/Navbar';
// import Preview from './Preview';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { useReactToPrint } from 'react-to-print';
// import { RESUME_API_END_POINT } from '@/utils/constant';

// const ResumeBuilder = () => {
//   const [resumeData, setResumeData] = useState({});
//   const [isUploading, setIsUploading] = useState(false);
//   const { _id } = useSelector(state => state.auth.user);
//   const contentRef = useRef(null);
//   const reactToPrintFn1 = useReactToPrint({
//     contentRef,
//     documentTitle: 'Resume',
//   });

//   const handleGenerateAndUpload = async () => {
//     try {
//       setIsUploading(true);

//       // Generate PDF Blob
//       const pdfBlob = new Blob([contentRef], {
//         type: 'application/pdf',
//       });

//       // Convert Blob to File
//       const pdfFile = new File([pdfBlob], 'resume.pdf', {
//         type: 'application/pdf',
//       });

//       // Prepare form data
//       const formData = new FormData();
//       formData.append('file', pdfFile);
//       formData.append('userId', _id);
//       formData.append('skills', JSON.stringify(resumeData.skills || []));
//       formData.append('projects', JSON.stringify(resumeData.projects || []));
//       formData.append(
//         'experience',
//         JSON.stringify(
//           JSON.stringify(resumeData.experience?.map(exp => exp.role) || []) ||
//             [],
//         ),
//       );

//       // Upload file to backend
//       const response = await axios.post(
//         `${RESUME_API_END_POINT}/upload-resume`,
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           withCredentials: true,
//         },
//       );

//       if (response.data.success) {
//         console.log('Resume uploaded successfully:', response.data);
//         reactToPrintFn1();
//       } else {
//         console.error('Failed to upload resume.');
//       }
//     } catch (error) {
//       console.error('Error uploading resume:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // const handleDownload = async () => {
//   //   // todo : make API call for AI gen of subm
//   //   // if (!resumeData.summary || resumeData.summary.trim() === '') {
//   //   //   try {
//   //   //     const response = await axios.post(
//   //   //       `${RESUME_API_END_POINT}/generateSummary`,
//   //   //       { prompt: 'Generate a summary based on user details.' }
//   //   //     );

//   //   //     if (response.status === 200 && response.data.summary) {
//   //   //       updatedData = { ...resumeData, summary: response.data };
//   //   //       setResumeData(updatedData); // Update state to reflect the summary
//   //   //     } else {
//   //   //       console.error('Failed to generate summary');
//   //   //     }
//   //   //   } catch (error) {
//   //   //     console.error('Error generating summary:', error);
//   //   //   }
//   //   // }

//   //   // reactToPrintFn();
//   // };

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-6 flex gap-6">
//         {/* Left: Form */}
//         <div className="w-1/2 bg-white border-2 p-4 rounded-lg shadow-md overflow-y-scroll">
//           <h2 className="font-bold border-b pb-1 text-center text-xl">Form</h2>
//           <FormSection onUpdate={setResumeData} />
//         </div>

//         {/* Right: Preview (Fixed) */}
//         <div className="w-1/2 border-2 bg-white p-4 rounded-lg shadow-md h-screen sticky top-0 overflow-y-auto">
//           {/* Wrap Preview in ref */}
//           <h2 className="font-bold border-b pb-1 text-center text-xl">
//             Preview
//           </h2>
//           <div ref={contentRef}>
//             {Object.keys(resumeData).length ? (
//               <Preview data={resumeData} />
//             ) : (
//               <p className="text-gray-500 text-center py-10">
//                 Fill out the form to see the preview
//               </p>
//             )}
//           </div>

//           {/* PDF Download Button (Only shows when data exists) */}
//           <button
//             onClick={handleGenerateAndUpload}
//             className={`mt-4 w-full py-2 rounded-md transition ${
//               Object.keys(resumeData).length
//                 ? 'bg-blue-600 text-white hover:bg-blue-700'
//                 : 'bg-gray-400 text-gray-200 cursor-not-allowed'
//             }`}
//             disabled={!Object.keys(resumeData).length || isUploading}
//           >
//             {isUploading ? 'Please wait...' : 'Generate PDF'}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResumeBuilder;
