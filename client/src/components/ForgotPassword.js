import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaMoon, FaSun, FaExternalLinkAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [demoLink, setDemoLink] = useState(null); // Store the link here
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setDemoLink(null);
    
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      
      // If backend sends a demo link, save it
      if (res.data.demoLink) {
        setDemoLink(res.data.demoLink);
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending link");
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
        <h2 style={{textAlign: "center"}}>Reset Password</h2>
        <p style={{textAlign: "center", color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px"}}>
            Enter your email to receive a reset link.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Generate Reset Link</button>
        </form>

        {/* DEMO LINK DISPLAY AREA */}
        {message && <p style={{ marginTop: "15px", textAlign: "center", color: "var(--accent-color)", fontWeight: "bold" }}>{message}</p>}
        
        {demoLink && (
            <div style={{
                marginTop: "15px", 
                padding: "15px", 
                background: "rgba(16, 185, 129, 0.1)", 
                border: "1px solid #10b981", 
                borderRadius: "8px",
                textAlign: "center"
            }}>
                <p style={{fontSize: "12px", color: "#065f46", margin: "0 0 5px 0"}}>
                    <b>Demo Mode:</b> Link generated successfully!
                </p>
                <a href={demoLink} style={{color: "#059669", fontWeight: "bold", textDecoration: "underline", wordBreak: "break-all"}}>
                    Click here to Reset Password <FaExternalLinkAlt size={10}/>
                </a>
            </div>
        )}

        <div style={{textAlign: "center", marginTop: "20px"}}>
            <Link to="/login" style={{textDecoration: "none", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px"}}>
                <FaArrowLeft /> Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;