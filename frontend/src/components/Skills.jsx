import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const skillsResponse = await axios.get("http://localhost:8000/api/v1/resume/getSkills", { withCredentials: true });
      setSkills(skillsResponse.data.skills);
  
      const projectsResponse = await axios.get("http://localhost:8000/api/v1/resume/getProjects", { withCredentials: true });
      setProjects(projectsResponse.data.projects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const verifyAndMockInterview = async (index, isProject = false) => {
    try {
      let updatedItems = isProject ? [...projects] : [...skills];
      updatedItems[index].isVerified = true;

      const itemName = updatedItems[index].name;
      const itemLevel = updatedItems[index].level+1 || "N/A"; // Default for projects without levels
      const prefix = isProject ? "Project: " : "Skill: ";
      const custinput = `${prefix}${itemName} (Level ${itemLevel})`;

      // Call AI Mock Interview API
      const response = await fetch("http://localhost:8000/api/v1/ai/mock-intv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: custinput }),
      });

      const data = await response.json();
      console.log("Mock Interview Data:", data);

      // Navigate to combined mock interview page
      navigate("/combinedMock", { state: { questions: data } });
    } catch (error) {
      console.error("Error during verification and AI request:", error);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-semibold text-purple-600 mb-6 text-center">
        Skills & Projects
      </h1>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Skills Section */}
        <div>
          <h2 className="text-2xl font-semibold text-purple-500 mb-4">Skills</h2>
          <div className="space-y-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-md bg-gray-50">
                  <span className="text-lg font-medium w-[25%]">{skill.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className={`w-5 h-5 rounded-md ${level <= skill.level ? "bg-purple-500" : "bg-gray-300"}`} />
                    ))}
                  </div>
                  {skill.isVerified ? (
                    skill.level === 3 ? (
                      <span className="text-green-500">✅ Verified</span>
                    ) : (
                      <span className="text-green-500">✅ Verified</span>
                    )
                  ) : (
                    <button
                      onClick={() => verifyAndMockInterview(index, false)}
                      className="bg-purple-500 text-white px-4 py-2 text-sm rounded-md hover:bg-purple-600 transition"
                    >
                      Verify
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No skills added.</p>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-semibold text-purple-500 mb-4">Projects</h2>
          <div className="space-y-3">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-md bg-gray-50">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">{project.name}</span>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  {project.isVerified ? (
                    <span className="text-green-500">✅ Verified</span>
                  ) : (
                    <button
                      onClick={() => verifyAndMockInterview(index, true)}
                      className="bg-purple-500 text-white px-4 py-2 text-sm rounded-md hover:bg-purple-600 transition"
                    >
                      Verify
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No projects added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
