import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ReactMediaRecorder } from "react-media-recorder";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { addFeedback,clearFeedbacks } from "../../redux/interviewFeedbackSlice";
const CameraScreen = ({ setTranscribedText }) => {
  // Accepting setTranscribedText as a prop
  const [uploading, setUploading] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcribedText, setLocalTranscribedText] = useState(""); // Store transcribed text locally
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const feedbackList = useSelector((state) => state.interviewFeedback.feedbackList);
  // Speech Recognition Hook
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    let stream = null;

    const getCameraStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    if (videoRef.current) {
      getCameraStream();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const uploadVideo = async (mediaBlobUrl) => {
    if (!mediaBlobUrl) {
      console.error("No recorded video found.");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(mediaBlobUrl);
      const videoBlob = await response.blob();

      const formData = new FormData();
      formData.append("video", videoBlob, "recording.webm");

      const uploadResponse = await axios.post(
        "http://localhost:8000/api/v1/mockinterview/upload-video",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(uploadResponse);
      setResultFile(uploadResponse.data.response);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setUploading(false);
  };

  // Parse resultFile as JSON
  let parsedResult = null;

  if (typeof resultFile === "string") {
    try {
      const cleanedResult = resultFile.replace(/```json|```/g, "").trim();
      parsedResult = JSON.parse(cleanedResult);
      console.log(cleanedResult, parsedResult);
    } catch (error) {
      console.error("Error parsing resultFile:", error);
    }
  } else if (typeof resultFile === "object") {
    parsedResult = resultFile;
  }
  // useEffect(() => {
  //   dispatch(clearFeedbacks()); // Clears the feedback list
  //   console.log("Feedback list cleared!");
  // }, [dispatch]);
  

  useEffect(() => {
    if (parsedResult) {
      // Check if parsedResult already exists in feedbackList
      const isDuplicate = feedbackList.some(
        (feedback) => JSON.stringify(feedback) === JSON.stringify(parsedResult)
      );
      
      
        dispatch(addFeedback(parsedResult)); // Push only if it's unique
        console.log("Added Unique Parsed Result:", parsedResult);
        console.log("Current Feedback List before adding:", feedbackList);
     
    }
  }, [parsedResult]);

  // Handle speech recording
  const startVoiceRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  const stopVoiceRecording = () => {
    SpeechRecognition.stopListening();
    setLocalTranscribedText(transcript); // Save final transcript locally
    setTranscribedText(transcript); // Pass transcribed text to parent component
  };

  return (
    <div className="w-[100%] border-2  flex m-20">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <ReactMediaRecorder
          video
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
            <div className="flex flex-col items-center">
              {/* Live Preview */}
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full rounded-lg mb-4 shadow-md"
                style={{ transform: "scaleX(-1)" }}
              />

              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => {
                    startRecording();
                    setRecording(true);
                  }}
                  disabled={recording}
                  className={`w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-full shadow-md transition-all flex items-center justify-center ${
                    recording && "opacity-75 cursor-not-allowed"
                  }`}
                >
                  🎥
                </button>
                <button
                  onClick={() => {
                    stopRecording();
                    setRecording(false);
                  }}
                  disabled={!recording}
                  className={`w-12 h-12 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-full shadow-md transition-all flex items-center justify-center ${
                    !recording && "opacity-75 cursor-not-allowed"
                  }`}
                >
                  ⏹️
                </button>
                <div className="flex space-x-4 mb-2">
                  <button
                    onClick={startVoiceRecording}
                    className={`w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all flex items-center justify-center ${
                      listening && "opacity-75 cursor-not-allowed"
                    }`}
                  >
                    🎤
                  </button>
                  <button
                    onClick={stopVoiceRecording}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-all flex items-center justify-center"
                  >
                    ⏹️
                  </button>
                </div>
              </div>

              {recording && (
                <div className="animate-pulse text-red-500 mb-2">
                  🔴 Recording...
                </div>
              )}
              {!recording && status === "recording" && (
                <div className="text-green-500 mb-2">✅ Recording Stopped</div>
              )}

              {mediaBlobUrl && (
                <button
                  onClick={() => uploadVideo(mediaBlobUrl)}
                  disabled={uploading}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
                >
                  {uploading ? "Uploading..." : "⬆️ Upload Video"}
                </button>
              )}

              {/* Speech Recording Section */}

              {/* Display Parsed Feedback */}
              {parsedResult && (
                <div className="mt-4 text-left p-4 border border-gray-300 rounded-lg shadow">
                  <h3 className="text-lg font-bold text-red-600 mb-2">
                    📋 Interview Feedback
                  </h3>

                  <div className="mb-3">
                    <p className="text-gray-700 font-semibold">
                      Score:{" "}
                      <span className="text-blue-600">
                        {parsedResult.Score}
                      </span>
                    </p>
                  </div>

                  {parsedResult.Feedback && (
                    <div className="mb-3">
                      <h4 className="text-gray-800 font-semibold mb-1">
                        💡 Feedback:
                      </h4>
                      <p className="text-gray-600">{parsedResult.Feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default CameraScreen;
