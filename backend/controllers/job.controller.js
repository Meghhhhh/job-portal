import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import natural from "natural"; // ✅ Import natural

// admin post krega job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Somethin is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// student k liye
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Collaborative Filtering (User-Based)
export const getSimilarJobs = async (userId, k = 5) => {
  try {
    const applications = await Application.find().populate("applicant job"); // ✅ Correct field name

    if (!applications.length) return [];

    const userJobMap = new Map();
    applications.forEach((app) => {
      if (!userJobMap.has(app.applicant._id.toString())) {
        // ✅ Use "applicant"
        userJobMap.set(app.applicant._id.toString(), new Set());
      }
      userJobMap.get(app.applicant._id.toString()).add(app.job._id.toString());
    });

    const targetUserJobs = userJobMap.get(userId.toString()) || new Set();
    const similarUsers = [];

    userJobMap.forEach((jobs, otherUser) => {
      if (otherUser !== userId.toString()) {
        const commonJobs = [...jobs].filter((job) => targetUserJobs.has(job));
        if (commonJobs.length > 0) {
          similarUsers.push({ userId: otherUser, score: commonJobs.length });
        }
      }
    });

    similarUsers.sort((a, b) => b.score - a.score);

    const recommendedJobs = new Set();
    for (let user of similarUsers.slice(0, k)) {
      userJobMap.get(user.userId).forEach((job) => {
        if (!targetUserJobs.has(job)) recommendedJobs.add(job);
      });
    }

    return await Job.find({ _id: { $in: Array.from(recommendedJobs) } }).limit(
      k
    );
  } catch (error) {
    console.error("Error in getSimilarJobs:", error);
    return [];
  }
};

// Content-Based Filtering (TF-IDF + NLP)
export const getSimilarJobsNLP = async (userId, k = 10) => {
  try {
    const applications = await Application.find({ applicant: userId }).populate(
      "job"
    );
    if (!applications.length) return [];

    const allJobs = await Job.find();

    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    allJobs.forEach((job) => {
      tfidf.addDocument(job.description);
    });

    const appliedJobIndices = applications.map((app) =>
      allJobs.findIndex((job) => job._id.equals(app.job._id))
    );
    if (appliedJobIndices.includes(-1)) return [];

    let jobScores = new Map();
    appliedJobIndices.forEach((index) => {
      const vec1 = tfidf.documents[index];
      allJobs.forEach((_, i) => {
        if (i !== index) {
          const vec2 = tfidf.documents[i];
          const similarity = Object.keys(vec1).reduce(
            (sum, key) => sum + vec1[key] * (vec2[key] || 0),
            0
          );
          jobScores.set(i, (jobScores.get(i) || 0) + similarity);
        }
      });
    });

    const sortedJobIndices = [...jobScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    return sortedJobIndices.slice(0, k).map((i) => allJobs[i]);
  } catch (error) {
    console.error("Error in getSimilarJobsNLP:", error);
    return [];
  }
};

// Combined API
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const collaborativeJobs = await getSimilarJobs(userId);
    const contentJobs = await getSimilarJobsNLP(userId);

    return res.status(200).json({
      collaborativeFiltering: collaborativeJobs,
      contentBasedFiltering: contentJobs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
