// import * as cheerio from "cheerio";
// import puppeteer from "puppeteer";
// uninstall please
// import axios from "axios";

import axios from "axios";
import * as cheerio from "cheerio";

async function fetchJobs(role, location) {
  const url = `https://en-in.whatjobs.com/jobs/${role}/${location}`;
  // https://en-in.whatjobs.com/jobs/web/mumbai/page-3

  try {
    // Fetch HTML data
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Load HTML into Cheerio
    const $ = cheerio.load(data);

    // Debug: Check total searchResultItem count
    console.log(
      "Total searchResultItem elements:",
      $(".searchResultItem").length
    );

    // Navigate through nested structure
    const jobs = [];
    $(".searchResultItem").each((index, element) => {
      // Detailed extraction with comprehensive logging
      const titleEl = $(element).find("h2.title");
      const title = titleEl.text().trim();
      console.log(`Job ${index} Title:`, title);

      const locationEl = $(element).find("li .wjIcon24.location");
      const locationText = locationEl.parent().text().trim();
      console.log(`Job ${index} Location:`, locationText);

      const companyEl = $(element).find("li .wjIcon24.companyName");
      const companyText = companyEl.parent().text().trim();
      console.log(`Job ${index} Company:`, companyText);

      const dateEl = $(element).find("li .wjIcon24.jobAge");
      const datePosted = dateEl.parent().text().trim();
      console.log(`Job ${index} Date:`, datePosted);

      const descriptionEl = $(element).find(".jDesc");
      const description = descriptionEl.text().trim();

      // Extract job link from onclick attribute
      const onclickAttr = $(element).attr("onClick") || "";
      const linkMatch = onclickAttr.match(/'(https:\/\/[^']+)'/);
      const link = linkMatch ? linkMatch[1] : "No Link Found";

      if (title && companyText) {
        jobs.push({
          title,
          company: companyText,
          location: locationText,
          datePosted,
          description,
          link,
        });
      }
    });

    console.log("Extracted Jobs:", jobs);
    return jobs;
  } catch (error) {
    console.error("Detailed Error:", error);
    return [];
  }
}

// Example usage
fetchJobs("sde", "india")
  .then((jobs) => console.log(jobs))
  .catch((err) => console.error(err));
