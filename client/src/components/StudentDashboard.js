import React, { useState, useEffect } from "react";
import api from "../api"; // <--- IMPORT API
import { FaWrench, FaHistory, FaCamera, FaSignOutAlt, FaUniversity, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({ hostel_name: "", facility_type: "", description: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("user_id");

  // Determine the base URL for images (Cloud or Local)
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const hostels = [
    "Imani (Men)", "Grace (Ladies)", "Patience (Ladies)", 
    "DUPA (Ladies)", "Faye Smith", "SCHU (Ladies)", 
    "SCHU (Men)", "Bethel (Men)"
  ];

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/api/reports?user_id=${userId}&role=student`);
      setReports(res.data.data);
    } catch (err) { console.error("Error fetching reports", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReport.hostel_name) { alert("Please select a hostel!"); return; }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("hostel_name", newReport.hostel_name);
    formData.append("facility_type", newReport.facility_type);
    formData.append("description", newReport.description);
    if (file) formData.append("image", file);

    try {
      // Use API helper
      await api.post("/api/reports/submit", formData, { headers: { "Content-Type": "multipart/form-data" }});
      setMessage("Report submitted successfully!");
      setNewReport({ hostel_name: "", facility_type: "", description: "" });
      setFile(null);
      fetchReports();
    } catch (err) { setMessage("Failed to submit report"); }
  };

  return (
    <div className="container">
      {/* GLASS HEADER */}
      <div className="dashboard-header">
        <div className="brand"><FaUniversity size={24}/> <h2>Student Portal</h2></div>
        <div className="header-actions">
            <button onClick={toggleTheme} className="btn-toggle">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button onClick={() => {localStorage.clear(); navigate("/login");}} className="btn-logout"><FaSignOutAlt/> Logout</button>
        </div>
      </div>

      <div className="card">
        <h3><FaWrench/> Report New Issue</h3>
        {message && <p style={{color: "#10b981", fontWeight: "bold"}}>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          
          {/* VISUAL HOSTEL SELECTOR */}
          <label style={{display:"block", marginBottom:"10px", fontWeight:"600"}}>Select Your Hostel</label>
          <div className="hostel-grid">
            {hostels.map((h) => (
                <div 
                    key={h} 
                    className={`hostel-option ${newReport.hostel_name === h ? 'selected' : ''}`}
                    onClick={() => setNewReport({...newReport, hostel_name: h})}
                >
                    {h}
                </div>
            ))}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="facility_type" value={newReport.facility_type} onChange={(e) => setNewReport({...newReport, facility_type: e.target.value})} required>
              <option value="">Select Category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Furniture">Furniture</option>
              <option value="Internet">Internet</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="Describe the problem..." value={newReport.description} onChange={(e) => setNewReport({...newReport, description: e.target.value})} required rows="3"/>
          </div>

          <div className="form-group">
             <label><FaCamera/> Attach Photo</label>
             <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{padding:"10px"}}/>
          </div>

          <button type="submit" className="btn-primary">Submit Report</button>
        </form>
      </div>

      <div className="card">
        <h3><FaHistory/> My Report History</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Date</th><th>Issue</th><th>Status</th><th>Comments</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                      <b>{r.facility_type}</b><br/>{r.description}
                      {/* DYNAMIC IMAGE LINK (Works on Cloud & Local) */}
                      {r.image_path && (
                        <a href={`${API_BASE_URL}${r.image_path}`} target="_blank" rel="noreferrer" style={{display: "block", marginTop: "5px", color: "var(--accent-color)", fontSize: "12px"}}>
                            View Photo 📷
                        </a>
                      )}
                  </td>
                  <td><span className={`badge ${r.status}`}>{r.status.replace('_', ' ')}</span></td>
                  <td>{r.comments || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;