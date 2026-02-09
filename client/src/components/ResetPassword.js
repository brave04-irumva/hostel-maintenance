import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/reset-password", { token, newPassword });
      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="container" style={{maxWidth: "400px", marginTop: "100px", position: "relative"}}>
      
      <div style={{position: "absolute", top: "-40px", right: "0"}}>
        <button onClick={toggleTheme} className="btn-toggle" style={{borderRadius: "50%", width: "40px", height: "40px", padding: 0}}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="card">
        <h2 style={{textAlign: "center"}}>Set New Password</h2>
        {message && <p style={{ color: message.includes("successful") ? "green" : "red", textAlign: "center" }}>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaLock /> New Password</label>
            <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;