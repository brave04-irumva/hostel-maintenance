import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaPhone, FaEnvelope, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const UserManagement = () => {
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("WARNING: This will delete the user AND all their submitted reports. Are you sure?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        alert("User deleted successfully.");
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user. Check console for details.");
        console.error(err);
      }
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>👥 User Management</h2>
        <div className="header-actions">
            {/* THEME TOGGLE */}
            <button onClick={toggleTheme} className="btn-toggle">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            
            {/* ELEGANT OUTLINE BUTTON */}
            <Link to="/admin-dashboard" className="btn-outline" style={{width: "auto"}}>
                <FaArrowLeft /> Back
            </Link>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{width: "20%"}}>Name</th>
                <th style={{width: "25%"}}>Contact Info</th>
                <th style={{width: "15%"}}>Role</th>
                <th style={{width: "15%"}}>Joined</th>
                <th style={{width: "10%"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px"}}>
                        <FaEnvelope color="var(--text-secondary)" size={12} /> {user.email}
                    </div>
                    {user.phone && (
                        <div style={{display: "flex", alignItems: "center", gap: "5px", color: "var(--accent-color)"}}>
                            <FaPhone size={12} /> {user.phone}
                        </div>
                    )}
                  </td>
                  <td>
                      <span className="badge" style={{
                          backgroundColor: user.role === 'admin' ? '#e0e7ff' : user.role === 'maintenance' ? '#fef9c3' : '#f3f4f6',
                          color: user.role === 'admin' ? '#4338ca' : user.role === 'maintenance' ? '#854d0e' : '#374151'
                      }}>
                          {user.role.toUpperCase()}
                      </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="btn-action" style={{backgroundColor: "#ff4d4d", color: "white"}}>
                        <FaTrash /> Delete
                    </button>
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

export default UserManagement;