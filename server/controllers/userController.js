const db = require("../db");

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, phone, role, created_at FROM users");
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Delete user's reports first to prevent foreign key error
    await db.query("DELETE FROM reports WHERE user_id = ?", [id]);

    // 2. Delete the user
    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User and their reports deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error: Could not delete user." });
  }
};