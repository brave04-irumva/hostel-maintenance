import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardCharts = ({ reports }) => {
  // 1. Data for Doughnut (Issues by Category)
  const faultCounts = {};
  reports.forEach((r) => {
    faultCounts[r.facility_type] = (faultCounts[r.facility_type] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(faultCounts),
    datasets: [{
      data: Object.values(faultCounts),
      backgroundColor: [
        "#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"
      ],
      borderWidth: 0,
    }],
  };

  // 2. Data for Bar (Issues by Hostel)
  const hostelCounts = {};
  reports.forEach((r) => {
    hostelCounts[r.hostel_name] = (hostelCounts[r.hostel_name] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(hostelCounts),
    datasets: [{
      label: "Active Reports",
      data: Object.values(hostelCounts),
      backgroundColor: "rgba(79, 70, 229, 0.8)",
      borderRadius: 5,
    }],
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" }}>
      
      {/* Doughnut Chart */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "var(--text-primary)" }}>Fault Distribution</h3>
        <div style={{ height: "250px", display: "flex", justifyContent: "center" }}>
          {reports.length > 0 ? <Doughnut data={doughnutData} /> : <p>No data yet</p>}
        </div>
      </div>

      {/* Bar Chart */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "var(--text-primary)" }}>Hostel Health Check</h3>
        <div style={{ height: "250px" }}>
           {reports.length > 0 ? <Bar data={barData} options={{ maintainAspectRatio: false }} /> : <p>No data yet</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;