import React from "react";
import StudentDashboard from "./dashboards/StudentDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

const DashboardRouter = () => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return <div>Unauthorized: No user type found.</div>;
  }

  switch (userType) {
    case "student":
      return <StudentDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <div>Invalid user type.</div>;
  }
};

export default DashboardRouter;
