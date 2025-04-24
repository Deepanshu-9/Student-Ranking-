import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const teacherData = JSON.parse(localStorage.getItem("user"));
  const teacher = teacherData.teacher;

  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/teacher-subjects", {
          params: { teacher_email: teacher.email },
        });

        if (Array.isArray(response.data)) {
          setSubjects(response.data);
        } else {
          setError("Subjects data is not in the expected format.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching subjects for this teacher.");
      }
    };

    fetchTeacherSubjects();
  }, [teacher.email]);

  const handleAddMarksClick = () => {
    navigate("/add-student-marks");
  };

  return (
    <div style={{ padding: "3rem", backgroundColor: "#f4f6f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#007BFF", fontSize: "2.5rem" }}>
          Welcome, {teacher.name}!
        </h2>
        <button
          onClick={handleAddMarksClick}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Add Student Marks
        </button>
      </div>

      {/* Profile Info */}
      <div style={{ marginBottom: "2rem", backgroundColor: "#ffffff", padding: "2rem", borderRadius: "8px" }}>
        <h4 style={{ fontWeight: "bold", color: "#333" }}>Profile Info:</h4>
        <p><strong>Name:</strong> {teacher.name}</p>
        <p><strong>Email:</strong> {teacher.email}</p>
      </div>

      {/* Assigned Subjects */}
      <div style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "8px" }}>
        <h4 style={{ fontWeight: "bold", color: "#333", marginBottom: "1.5rem" }}>Assigned Subjects:</h4>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {subjects.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Subject Code</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Subject Name</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Semester</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subj.subject_code}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subj.subject_name}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subj.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && <p>No subjects assigned.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
