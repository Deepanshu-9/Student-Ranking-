import React, { useEffect, useState } from "react";
import axios from "axios";
import ReassignSubject from "./ReassignSubject";

const AssignSubject = () => {
  const [assignments, setAssignments] = useState([]);
  const [showReassign, setShowReassign] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/get-teacher-subjects")
      .then((res) => {
        const grouped = res.data.reduce((acc, curr) => {
          if (!acc[curr.teacher_name]) {
            acc[curr.teacher_name] = [];
          }
          acc[curr.teacher_name].push({
            subject: curr.subject_name,
            semester: curr.semester,
          });
          return acc;
        }, {});
        setAssignments(grouped);
      })
      .catch((err) => {
        console.error("Error fetching teacher-subject assignments:", err);
      });
  }, []);

  if (showReassign) return <ReassignSubject />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700">Teacher Subject Mapping</h1>
        <button
          onClick={() => setShowReassign(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Reassign Subjects
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {Object.entries(assignments).map(([teacher, subjects], index) => {
          const sortedSubjects = [...subjects].sort((a, b) => a.semester - b.semester);
          return (
            <div key={index} className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{teacher}</h3>
              <ul className="space-y-1 text-sm">
                {sortedSubjects.map((subj, i) => (
                  <li key={i} className="text-gray-700">
                    {subj.subject}{" "}
                    <span className="text-gray-500">(Sem {subj.semester})</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignSubject;
