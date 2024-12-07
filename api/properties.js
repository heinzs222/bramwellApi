// api/properties/index.js
const fetch = require("node-fetch");
const xml2js = require("xml2js");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://bramwellre.com"); // Replace with your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const apiUrl =
    "https://bramwellre.my.salesforce-sites.com/webhook/services/apexrest/XmlResponse/Propertyfinder";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(
        `Salesforce API Error: ${response.status} - ${response.statusText}`
      );
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from Salesforce API" });
    }

    const data = await response.text(); // Assuming the API returns XML as text

    // Convert XML to JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(data);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during function execution:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
