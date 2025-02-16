import React, { useState, useRef } from 'react';
import FormSection from './FormSection';
import Navbar from '../shared/Navbar';
import Preview from './Preview';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RESUME_API_END_POINT } from '@/utils/constant';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const { _id } = useSelector(state => state.auth.user);
  const contentRef = useRef(null);

  const generatePDF = async () => {
    if (!contentRef.current) return null;
  
    // Set temporary style for capture
    const originalStyle = contentRef.current.style.cssText;
    contentRef.current.style.width = '795px'; // A4 width in pixels at 96 DPI
  
    const canvas = await html2canvas(contentRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
  
    // Restore original style
    contentRef.current.style.cssText = originalStyle;
  
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
  
    const imgWidth = canvas.width * 0.264583; // Convert pixels to mm
    const imgHeight = canvas.height * 0.264583;
  
    let yPosition = 0;
    const pageCanvasHeight = (pageHeight / imgWidth) * canvas.width; // Height of a single page in the image
  
    while (yPosition < imgHeight) {
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageCanvasHeight, canvas.height - yPosition);
  
      const pageCtx = pageCanvas.getContext('2d');
      pageCtx.drawImage(
        canvas,
        0,
        yPosition / 0.264583, // Convert mm to pixels
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );
  
      if (yPosition > 0) pdf.addPage();
      pdf.addImage(
        pageCanvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        pageWidth,
        (pageCanvas.height * pageWidth) / canvas.width
      );
  
      yPosition += pageCanvasHeight;
    }
  
    return pdf;
  };
  

  const handleGenerateAndUpload = async () => {
    try {
      setIsUploading(true);

      const pdf = await generatePDF();
      if (!pdf) {
        console.error('Failed to generate PDF');
        return;
      }

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], 'resume.pdf', {
        type: 'application/pdf',
      });

      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('userId', _id);
      formData.append('skills', JSON.stringify(resumeData.skills || []));
      formData.append('projects', JSON.stringify(resumeData.projects || []));
      formData.append(
        'experience',
        JSON.stringify(
          JSON.stringify(resumeData.experience?.map(exp => exp.role) || []) ||
            [],
        ),
      );

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
        pdf.save('resume.pdf');
      } else {
        console.error('Failed to upload resume.');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setIsUploading(false);
    }
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
            {Object.keys(resumeData).length ? (
              <Preview data={resumeData} />
            ) : (
              <p className="text-gray-500 text-center py-10">
                Fill out the form to see the preview
              </p>
            )}
          </div>

          {/* PDF Download Button */}
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
    </>
  );
};

export default ResumeBuilder;























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
