import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";

import { Button } from "./ui/button";

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
      </div>

      <LatestJobs />
      <RecommendedJobs />
      <Footer />
    </div>
  );
};

export default Home;
