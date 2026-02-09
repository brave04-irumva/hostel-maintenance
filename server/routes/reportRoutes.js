const express = require("express");
const router = express.Router();

// 1. Import Controller Functions
const { 
  getAllReports, 
  createReport, 
  updateReportStatus 
} = require("../controllers/reportController");

// 2. Import Upload Middleware
const upload = require("../middleware/uploadMiddleware");

// ==========================
// DEFINING ROUTES
// ==========================

// GET /api/reports (Fetch reports)
router.get("/", getAllReports);

// POST /api/reports/submit (Submit new report with image)
// 'image' matches the name="" attribute in your frontend form
router.post("/submit", upload.single("image"), createReport);

// PUT /api/reports/update-status (Update status/comments)
router.put("/update-status", updateReportStatus);

module.exports = router;