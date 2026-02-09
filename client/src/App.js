import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword"; // Import
import ResetPassword from "./components/ResetPassword";   // Import
import StudentDashboard from "./components/StudentDashboard";
import MaintenanceDashboard from "./components/MaintenanceDashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import './App.css';

function App() {
  return (
    <ThemeProvider> 
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* NEW PASSWORD ROUTES */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;