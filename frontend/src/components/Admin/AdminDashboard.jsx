// src/components/Admin/AdminDashboard.js
import { Link } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="admin-content">
        <nav>
          <ul>
            <li><Link to="/admin/company-management">Company Management</Link></li>
            <li><Link to="/admin/communication-method-management">Communication Method Management</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
