import React, { useState, useEffect } from "react";
import api from "../api"; // <--- IMPORT API
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaSignOutAlt, FaBuilding, FaMoon, FaSun, FaFilePdf, FaBell } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import DashboardCharts from "./DashboardCharts";
import io from "socket.io-client";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Connect to Socket.io (Dynamic URL for Deployment)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const socket = io(API_BASE_URL);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [reports, setReports] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchReports();

    // 🔥 LIVE WIRE: Listen for new reports
    socket.on("new_report", (newReport) => {
      // Update state instantly
      setReports((prev) => [newReport, ...prev]);
      
      // Show notification toast
      setNotification(`New ${newReport.facility_type} report from ${newReport.hostel_name}!`);
      setTimeout(() => setNotification(null), 5000); // Hide after 5s
    });

    return () => {
      socket.off("new_report");
    };
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/api/reports?role=admin`);
      setReports(res.data.data);
    } catch (err) { console.error(err); }
  };

  // 📄 PAPER TRAIL: Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title & Header
    doc.setFontSize(18);
    doc.text("Daystar University - Maintenance Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table
    const tableColumn = ["Date", "Reporter", "Hostel", "Issue", "Priority", "Status"];
    const tableRows = [];

    reports.forEach(report => {
      const reportData = [
        new Date(report.created_at).toLocaleDateString(),
        report.reporter_name,
        report.hostel_name,
        report.facility_type,
        report.priority.toUpperCase(),
        report.status.toUpperCase()
      ];
      tableRows.push(reportData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] } // University Blue
    });

    doc.save("Maintenance_Report.pdf");
  };

  // Stats for Header
  const total = reports.length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const urgent = reports.filter(r => r.priority === 'urgent').length;

  return (
    <div className="container">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div style={{
            position: "fixed", top: "20px", right: "20px", background: "#10b981", color: "white", 
            padding: "15px 25px", borderRadius: "10px", boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            zIndex: 1000, animation: "slideIn 0.5s ease-out", display: "flex", alignItems: "center", gap: "10px"
        }}>
            <FaBell /> {notification}
        </div>
      )}

      <div className="dashboard-header">
        <div className="brand"><FaBuilding size={24}/> <h2>Admin Overview</h2></div>
        <div className="header-actions">
            <button onClick={toggleTheme} className="btn-toggle">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <Link to="/admin/users" className="btn-outline" style={{marginRight: "10px"}}>
                <FaUsers/> Manage Users
            </Link>
            {/* PDF BUTTON */}
            <button onClick={generatePDF} className="btn-primary" style={{width: "auto", background: "#ef4444"}}>
                <FaFilePdf/> Export PDF
            </button>
            <button onClick={() => {localStorage.clear(); navigate("/login");}} className="btn-logout"><FaSignOutAlt/></button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="stats-grid">
        <div className="stat-card blue">
            <div className="stat-info"><h3>{total}</h3><p>Total Reports</p></div>
        </div>
        <div className="stat-card green">
            <div className="stat-info"><h3>{resolved}</h3><p>Resolved</p></div>
        </div>
        <div className="stat-card orange">
            <div className="stat-info"><h3>{urgent}</h3><p>⚠️ High Alert</p></div>
        </div>
      </div>

      {/* 📊 COMMAND CENTER: CHARTS */}
      <DashboardCharts reports={reports} />

      <div className="card">
        <h3>Live Activity Feed</h3>
        <div className="table-container">
          <table>
            <thead>
                <tr>
                    <th className="col-date">Date</th>
                    <th className="col-hostel">Reporter</th>
                    <th className="col-issue">Issue</th>
                    <th className="col-status">Priority</th>
                    <th className="col-status">Status</th>
                </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                      <strong>{r.reporter_name}</strong><br/>
                      <span style={{fontSize: "12px", color: "var(--text-secondary)"}}>{r.reporter_email}</span>
                  </td>
                  <td>
                      <strong>{r.facility_type}</strong>
                      <div className="desc-text">{r.hostel_name}</div>
                  </td>
                  <td>{r.priority === 'urgent' ? <b style={{color:'#ef4444'}}>URGENT</b> : r.priority.toUpperCase()}</td>
                  <td><span className={`badge ${r.status}`}>{r.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;