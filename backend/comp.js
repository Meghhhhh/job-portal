import axios from "axios";

const API_URL = "https://api.theirstack.com/v1/companies/search";
const API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHViaGRvc2hpMjFAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIn0.zinMLBAMGtY5H033ETDtnnpRVelt8GxDDgHt9NX37Tk";

async function fetchCompanies() {
  try {
    const response = await axios.post(
      API_URL,
      {
        page: 0,
        limit: 10,
        order_by: [
          { desc: true, field: "confidence" },
          { desc: true, field: "jobs" },
          { desc: true, field: "num_jobs" },
        ],
        company_country_code_or: ["IN"],
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

    console.log("Company Listings:", response.data);
  } catch (error) {
    console.error("Error fetching companies:", error.message);
  }
}

fetchCompanies();
