const db = require("../db");

exports.getAllReports = async (req, res) => {
  const { role, user_id } = req.query;
  try {
    let query = "SELECT * FROM reports";
    let params = [];

    if (role === "student") {
      query += " WHERE user_id = ?";
      params.push(user_id);
    }
    query += " ORDER BY created_at DESC";

    const [reports] = await db.query(query, params);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createReport = async (req, res) => {
  const { user_id, hostel_name, facility_type, description } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // 1. Get User Details (for the live notification)
    const [user] = await db.query("SELECT name, email FROM users WHERE id = ?", [user_id]);
    const reporterName = user[0]?.name || "Unknown";
    const reporterEmail = user[0]?.email || "Unknown";

    // 2. Insert Report
    const [result] = await db.query(
      "INSERT INTO reports (user_id, reporter_name, reporter_email, hostel_name, facility_type, description, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, reporterName, reporterEmail, hostel_name, facility_type, description, image_path]
    );

    // 3. Construct the new report object
    const newReport = {
      id: result.insertId,
      user_id,
      reporter_name: reporterName,
      reporter_email: reporterEmail,
      hostel_name,
      facility_type,
      description,
      image_path,
      status: "pending",
      priority: "low", // Default
      created_at: new Date(),
    };

    // 4. 🔥 LIVE WIRE: Broadcast this event to everyone!
    req.io.emit("new_report", newReport);

    res.status(201).json({ message: "Report submitted successfully", data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateReportStatus = async (req, res) => {
  const { report_id, status, comments } = req.body;
  try {
    await db.query("UPDATE reports SET status = ?, comments = ? WHERE id = ?", [status, comments, report_id]);
    
    // Notify clients about the update
    req.io.emit("report_updated", { id: report_id, status, comments });

    res.json({ message: "Report updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};