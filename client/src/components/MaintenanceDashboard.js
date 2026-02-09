import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTools, FaCheck, FaExclamationTriangle, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [reports, setReports] = useState([]);
  const [commentText, setCommentText] = useState({});

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`/api/reports?role=maintenance`);
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, status) => {
    const comment = commentText[id] || "";
    await axios.put("/api/reports/update-status", { report_id: id, status, comments: comment });
    alert(`Report marked as ${status}`);
    fetchReports();
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <div className="brand"><FaTools size={24}/> <h2>Maintenance Panel</h2></div>
        <div className="header-actions">
            {/* THEME TOGGLE */}
            <button onClick={toggleTheme} className="btn-toggle">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button onClick={() => {localStorage.clear(); navigate("/login");}} className="btn-logout"><FaSignOutAlt/> Logout</button>
        </div>
      </div>

      <div className="card">
        <h3>Incoming Work Orders</h3>
        <p style={{marginBottom: "15px", fontSize: "14px", color: "var(--text-secondary)"}}>High priority items are automatically sorted to the top.</p>
        
        <div className="table-container">
          <table>
            <thead>
                <tr>
                    <th className="col-status">Priority</th>
                    <th className="col-hostel">Location</th>
                    <th className="col-issue">Issue / Photo</th>
                    <th className="col-action">Technician Actions</th>
                </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={{backgroundColor: r.priority === 'urgent' && theme === 'light' ? '#fff5f5' : 'transparent'}}>
                  <td>
                      {r.priority === 'urgent' ? <span className="badge pending"><FaExclamationTriangle/> URGENT</span> : 
                       r.priority === 'high' ? <span className="badge progress">HIGH</span> : <span className="badge resolved">LOW</span>}
                  </td>
                  <td>{r.hostel_name}</td>
                  <td>
                    <b>{r.facility_type}</b>
                    <div className="desc-text">{r.description}</div>
                    {/* IP ADDRESS UPDATED HERE */}
                    {r.image_path && (
                      <a href={`http://192.168.1.121:5000${r.image_path}`} target="_blank" rel="noreferrer" style={{display: "block", marginTop: "5px", color: "var(--accent-color)", fontSize: "12px"}}>View Photo 📷</a>
                    )}
                  </td>
                  <td>
                    <div className="technician-actions">
                        <textarea 
                          className="tech-note"
                          placeholder="Add technical comments..." 
                          onChange={(e) => setCommentText({...commentText, [r.id]: e.target.value})}
                        />
                        <div className="action-buttons">
                          {r.status !== 'in_progress' && r.status !== 'resolved' && 
                              <button onClick={() => handleUpdate(r.id, 'in_progress')} className="btn-action btn-start">Start Work</button>}
                          {r.status !== 'resolved' && 
                              <button onClick={() => handleUpdate(r.id, 'resolved')} className="btn-action btn-done"><FaCheck/> Mark Done</button>}
                        </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default MaintenanceDashboard;