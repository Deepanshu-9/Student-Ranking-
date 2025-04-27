import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Heading } from "@chakra-ui/react";
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
    <div className="p-12  pt-22 bg-zinc-800 min-h-screen">
      <div className="flex justify-between  items-center mb-8">
        <Heading className="text-5xl text-teal-100 font-bold ">
          Welcome, {teacher.name}!
        </Heading>
        <Button
          onClick={handleAddMarksClick}
          className="px-6 py-2 bg-teal-600  font-semibold rounded-xl text-lg shadow-md hover:bg-teal-300 transition"
        >
          Add Student Marks
        </Button>
      </div>

      {/* Profile Info */}
      <div className="mb-8 bg-zinc-300 p-8 rounded-xl shadow-xl">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Profile Info:</h3>
        <p className="text-2xl">
          <span className="text-2xl font-semibold">Name:</span> {teacher.name}
        </p>
        <p className="text-2xl">
          <span className="text-2xl font-semibold">Email:</span> {teacher.email}
        </p>
      </div>

      {/* Assigned Subjects */}
      <div className="bg-zinc-900 p-8 rounded-lg shadow-sm">
        <div className="text-4xl font-bold text-purple-100 p-2 mb-3 ">
          Assigned Subjects:
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {subjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl border-gray-300">
              <thead>
                <tr className="bg-teal-100 text-xl ">
                  <th className="p-3 border border-gray-900">Subject Code</th>
                  <th className="p-3 border border-gray-900">Subject Name</th>
                  <th className="p-3 border border-gray-900">Semester</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-zinc-600" : "bg-zinc-700"}
                  >
                    <td className="p-3 border text-center text-purple-100 text-xl border-gray-900">
                      {subj.subject_code}
                    </td>
                    <td className="p-3 border text-center text-purple-100 text-xl border-gray-900">
                      {subj.subject_name}
                    </td>
                    <td className="p-3 border text-center text-purple-100 text-xl border-gray-900">
                      {subj.semester}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && <p>No subjects assigned.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
