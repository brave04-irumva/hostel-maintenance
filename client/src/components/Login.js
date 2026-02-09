import React, { useState } from "react";
import api from "../api"; // <--- USING CENTRALIZED API
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // USES API HELPER (Base URL is handled automatically)
      const res = await api.post("/api/auth/login", formData);
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem("user_id", payload.id);
      localStorage.setItem("role", role);

      setMessage("Login successful!");

      setTimeout(() => {
        if (role === 'admin') {
            navigate("/admin-dashboard");
        } else if (role === 'maintenance') {
            navigate("/maintenance-dashboard");
        } else {
            navigate("/student-dashboard");
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Wrong email/password. Try again!");
    }
  };

  return (
    <div className="container" style={{maxWidth: "400px", marginTop: "100px", position: "relative"}}>
      
      {/* THEME TOGGLE */}
      <div style={{position: "absolute", top: "-40px", right: "0"}}>
        <button onClick={toggleTheme} className="btn-toggle" style={{borderRadius: "50%", width: "40px", height: "40px", padding: 0}}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="card">
        <h2 style={{textAlign: "center", marginBottom: "20px"}}>Welcome Back</h2>
        {message && <p style={{ color: message.includes("successful") ? "green" : "red", textAlign: "center" }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>
          
          {/* FORGOT PASSWORD LINK */}
          <div style={{textAlign: "right", marginBottom: "15px"}}>
            <Link to="/forgot-password" style={{fontSize: "13px", color: "var(--text-secondary)", textDecoration: "none"}}>Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p style={{textAlign: "center", marginTop: "15px", fontSize: "14px"}}>
          Don't have an account? <Link to="/register" style={{color: "var(--accent-color)", fontWeight: "600"}}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;