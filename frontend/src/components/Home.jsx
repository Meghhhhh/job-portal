import React, { useEffect } from "react";
import { toast } from "react-hot-toast";

import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";

import { Button } from "./ui/button";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RecommendedJobs from "./RecommendedJobs";


const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  const handleAutoApply = async () => {
    try {
      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/autoApplyForJobs`,
        {},
        {
          withCredentials: true, 
        }
      );

      console.log("Auto Apply Response:", response.data);
      toast.success("Successfully applied to jobs!");
    } catch (error) {
      console.error("Error auto-applying:", error);
      toast.error(error.response?.data?.message || "Failed to auto-apply.");
    }
  };

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />

      {/* Centered Button */}
      <div className="flex justify-center my-10">
        <Button
          className="buttonContainer bg-[#6A38C2] text-white hover"
          variant="outline"
          size="lg"
          onClick={() => navigate("/MockDashboard")}
        >
          Get your mock interviews for free 🚀
        </Button>
        <Button
          className="buttonContainer bg-[#6A38C2] text-white hover mx-3"
          variant="outline"
          size="lg"
          onClick={handleAutoApply}
        >
          Auto apply for jobs
        </Button>
      </div>

      <LatestJobs />
      <RecommendedJobs />
      <Footer />
    </div>
  );
};

export default Home;
