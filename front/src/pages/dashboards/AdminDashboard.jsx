import React, { useState } from "react";
import './AdminDashboard.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddStudent from "./AdminDashboardComponents/AddStudent";
import MarkUploadCheck from "./AdminDashboardComponents/MarkUploadCheck";
import { h1 } from "framer-motion/client";
import AddTeacher from "./AdminDashboardComponents/AddTeacher";
import AssignSubject from "./AdminDashboardComponents/AssignSubject";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addStudent");

  const renderTab = () => {
    switch (activeTab) {
      case "addStudent":
        return <AddStudent />;
      case "addTeacher":
        return <AddTeacher/>;
      case "assignSubject":
        return <AssignSubject/>;
      
      case "checkMarks":
        return <MarkUploadCheck />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      <h1 className="dashboard-title">📋 Admin Dashboard</h1>

      <div className="admin-nav">
        <button className={activeTab === "addStudent" ? "active" : ""} onClick={() => setActiveTab("addStudent")}>Add Student</button>
        <button className={activeTab === "addTeacher" ? "active" : ""} onClick={() => setActiveTab("addTeacher")}>Add Teacher</button>
        <button className={activeTab === "assignSubject" ? "active" : ""} onClick={() => setActiveTab("assignSubject")}>Assigned Subject</button>

        <button className={activeTab === "checkMarks" ? "active" : ""} onClick={() => setActiveTab("checkMarks")}>Marks Upload Check</button>
      </div>

      <div className="admin-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
