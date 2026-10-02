const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "CyberShield backend is running",
    version: "1.0.0"
  });
});

const incidents = [];

app.get("/api/incidents", (req, res) => {
  res.json({
    success: true,
    count: incidents.length,
    incidents
  });
});

app.post("/api/incidents", (req, res) => {
  const { title, description, category, severity } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required."
    });
  }

  const incident = {
    id: `CS-${Date.now()}`,
    title,
    description,
    category: category || "Uncategorized",
    severity: severity || "Medium",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  incidents.unshift(incident);

  res.status(201).json({
    success: true,
    incident
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "CyberShield API",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "CyberShield API route not found."
  });
});

app.listen(PORT, () => {
  console.log(`CyberShield backend running on port ${PORT}`);
});
  
