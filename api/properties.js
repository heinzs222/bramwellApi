// api/properties.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const apiUrl =
    "https://bramwellre.my.salesforce-sites.com/webhook/services/apexrest/XmlResponse/Propertyfinder";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Salesforce API Error: ${response.statusText}`);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from Salesforce API" });
    }

    const data = await response.text(); // Assuming the API returns XML as text

    // Set XML Content-Type header and send response
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(data);
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
