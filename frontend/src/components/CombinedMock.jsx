import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TestPage from "./Test";
import CameraScreen from "./MockInterview/CameraScreen";

const CombinedMock = () => {
  const location = useLocation();
  const questionList = location.state?.questions?.result || location.state?.questions || [];
  const [transcribedText, setTranscribedText] = useState("");

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 border-2">
        <TestPage questions={questionList} transcribedText={transcribedText} />
      </div>
      <div className="w-1/2 border-2">
        <CameraScreen setTranscribedText={setTranscribedText} />
      </div>
    </div>
  );
};

export default CombinedMock;
