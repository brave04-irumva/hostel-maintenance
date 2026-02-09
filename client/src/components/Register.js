import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Import Theme Hook

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student", // Default
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Get theme logic

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", formData);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="container" style={{maxWidth: "450px", marginTop: "50px", position: "relative"}}>
      
      {/* THEME TOGGLE (Floating Top Right) */}
      <div style={{position: "absolute", top: "-40px", right: "0"}}>
        <button onClick={toggleTheme} className="btn-toggle" style={{borderRadius: "50%", width: "40px", height: "40px", padding: 0}}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="card">
        <h2 style={{textAlign: "center"}}>Create Account</h2>
        {message && <p style={{ color: "#4f46e5", textAlign: "center", fontWeight: "bold" }}>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label style={{fontSize: "14px", fontWeight: "600", marginBottom: "5px", display: "block"}}>I am a:</label>
            <select name="role" onChange={handleChange} required>
              <option value="student">Student</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p style={{textAlign: "center", marginTop: "15px", fontSize: "14px"}}>
          Already have an account? <Link to="/login" style={{color: "var(--accent-color)", fontWeight: "600"}}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;