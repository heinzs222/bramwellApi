// api/properties/[slug].js
const fetch = require("node-fetch");
const xml2js = require("xml2js"); // Ensure xml2js is installed

module.exports = async (req, res) => {
  const { slug } = req.query; // Extract slug from the URL

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://bramwellre.com"); // Replace with your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!slug) {
    res.status(400).json({ error: "Property slug is required." });
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

    // Convert XML to JSON for easier processing
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(data);

    // Extract properties from the parsed JSON
    const properties = result?.properties?.property;

    if (!properties) {
      throw new Error("No properties found in the API response.");
    }

    // Ensure properties is an array
    const propertiesArray = Array.isArray(properties) ? properties : [properties];

    // Find the property matching the slug
    const matchedProperty = propertiesArray.find((prop) => {
      const propertySlug = prop.title_en
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      return propertySlug === slug;
    });

    if (!matchedProperty) {
      return res.status(404).json({ error: "Property not found." });
    }

    // Convert the matched property back to XML or return as JSON
    // Here, we'll return as JSON for easier handling on the frontend
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(matchedProperty);
  } catch (error) {
    console.error("Error during function execution:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
