import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  PYTHON_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [showModal, setShowModal] = useState(false);
  const [atsResume, setAtsResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resumePreview = useSelector(
    (store) => store.auth.user?.profile?.resume
  );
  const params = useParams();
  const jobId = params.id;
  const hasResume = !!resumePreview || !!atsResume;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const [atsFeedback, setAtsFeedback] = useState(null); // Store ATS response

  const handleATSEnhancement = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      if (resumePreview) {
        // If resume URL exists, send only the URL
        formData.append("resume_url", user.profile.resume);
      } else if (atsResume) {
        // Otherwise, send the uploaded file
        formData.append("pdf_doc", atsResume);
      } else {
        return toast.error("Please upload a PDF resume.");
      }

      formData.append("job_description", singleJob?.description);

      const response = await axios.post(`${PYTHON_API_END_POINT}/ats`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setAtsFeedback(response.data); // Store ATS feedback
      }
    } catch (error) {
      console.error("Error in ATS Evaluation:", error);
      toast.error("Error in ATS Evaluation.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const updateResumeHandler = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/update-resume`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Updated User Response:", res.data); // Debugging
      if (res.data.success && res.data.user) {
        dispatch(setUser(res.data.user)); // Ensure updated user is stored
        toast.success("Resume updated successfully!");
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to update resume.");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              {singleJob?.postion} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experience} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2 overflow-scroll max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">
              Enhance Your Resume with ATS
            </h2>
            <form onSubmit={handleATSEnhancement}>
              <p className="text-sm text-gray-600 mb-2">
                Get AI-powered ATS feedback to improve your resume
              </p>
              <textarea
                rows="3"
                className="w-full p-2 border rounded-lg bg-gray-100"
                value={singleJob?.description}
                readOnly
              />
              {resumePreview && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-100">
                  <h2 className="font-bold text-lg">Resume Preview</h2>
                  <iframe
                    src={resumePreview}
                    title="Resume Preview"
                    className="w-full h-96 mt-3 border rounded-lg"
                  ></iframe>
                  <label className="block mt-3">
                    <span className="text-gray-600">Update Resume:</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="mt-1 block w-full border rounded-lg p-2"
                      onChange={updateResumeHandler}
                    />
                  </label>
                </div>
              )}
              {!hasResume && (
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full p-2 border rounded-lg mt-2"
                  onChange={(e) => setAtsResume(e.target.files[0])}
                />
              )}
              {hasResume && !atsFeedback && (
                <button
                  type="submit"
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex justify-center items-center"
                  disabled={isLoading} // Disable while loading
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">&#x231B;</span>
                      Loading...
                    </>
                  ) : (
                    "Get ATS Enhancement Tips"
                  )}
                </button>
              )}
            </form>

            {/* Display ATS Feedback if available */}
            {atsFeedback && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="font-bold text-md text-gray-800">
                  ATS Feedback:
                </h3>
                {Object.keys(atsFeedback).map((key) => (
                  <p key={key} className="text-sm text-gray-600">
                    <strong>{key}:</strong> {JSON.stringify(atsFeedback[key])}
                  </p>
                ))}
              </div>
            )}
            {hasResume && !atsFeedback && (
              <button
                onClick={applyJobHandler}
                className="w-full my-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Apply with Current Profile Resume
              </button>
            )}
            {/* Apply Button appears only after getting ATS tips */}
            {atsFeedback && (
              <button
                onClick={applyJobHandler}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Apply Now
              </button>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescription;
