// api/properties.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins. Replace "*" with your frontend URL for better security.
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const apiUrl =
    "https://bramwellre.my.salesforce-sites.com/webhook/services/apexrest/XmlResponse/Website";

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

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(data);
  } catch (error) {
    console.error("Error during function execution:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
