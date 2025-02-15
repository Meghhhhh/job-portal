import axios from "axios";

const API_URL = "https://api.theirstack.com/v1/jobs/search/";
const API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHViaGRvc2hpMjFAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIn0.zinMLBAMGtY5H033ETDtnnpRVelt8GxDDgHt9NX37Tk";

async function fetchJobs() {
  try {
    const response = await axios.post(
      API_URL,
      {
        page: 0,
        limit: 10,
        posted_at_max_age_days: 15,
        order_by: [{ desc: true, field: "date_posted" }],
        job_country_code_or: ["IN"],
        include_total_results: false,
        blur_company_data: false,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: API_KEY,
        },
      }
    );

    console.log("Job Listings:", response.data);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
  }
}

fetchJobs();


