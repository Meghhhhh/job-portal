import React from "react";
import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import useGetRecommendedJobs from "../hooks/useGetRecommendedJobs"; // ✅ Import custom hook

const RecommendedJobs = () => {
  useGetRecommendedJobs(); // ✅ Call the custom hook

  const { recommendedJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Recommended</span> Job Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {!recommendedJobs || recommendedJobs?.length <= 0 ? (
          <span>No Job Available</span>
        ) : (
          recommendedJobs
            .slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;
