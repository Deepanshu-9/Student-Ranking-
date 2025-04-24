import React, { useState, useEffect } from "react";
import profileimage from "../assets/profile.png";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [rankings, setRankings] = useState([]);
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    // Fetch rankings if batch and semester are selected
    if (batch && semester) {
      fetchRankings();
    }
  }, [batch, semester]);

  const fetchRankings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rankings", {
        params: {
          batch,
          semester,
        },
      });
      setRankings(res.data);
    } catch (err) {
      setError("Failed to fetch rankings.");
    }
  };

  // Handle student card click and navigate to ResultDetail page
  const handleCardClick = (studentRollNumber, studentName) => {
    navigate(`/resultdetail/${studentRollNumber}`, {
      state: { batch, semester, rollNumber: studentRollNumber, studentName },
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
            Select Batch and Semester
          </h2>

          {/* Batch and Semester Selection */}
          <div className="flex justify-between mb-6">
            <select
              onChange={(e) => setBatch(e.target.value)}
              value={batch}
              className="w-1/2 mr-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Batch</option>
              <option value="2022-2025">2022-2025</option>
              <option value="2023-2026">2023-2026</option>
              <option value="2024-2027">2024-2027</option>
            </select>

            <select
              onChange={(e) => setSemester(e.target.value)}
              value={semester}
              className="w-1/2 ml-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>

          {/* Display Rankings */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rankings.map((student, index) => (
              <div
                key={student.student_roll_number}
                className="bg-purple-50 border border-purple-200 rounded-xl shadow-md p-4 transition hover:shadow-lg cursor-pointer"
                onClick={() =>
                  handleCardClick(student.student_roll_number, student.student_name) // Pass student roll number and name
                }
              >
                <div className="flex flex-col items-center">
                  {/* Temporary Avatar Image */}
                  <img
                    src={profileimage} // Static avatar
                    alt="Student Avatar"
                    className="w-20 h-20 rounded-full mb-3 shadow-md object-cover"
                  />
                  <h3 className="text-lg font-bold text-purple-700 mb-1">
                    Rank #{student.rank}
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {student.student_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Roll: {student.student_roll_number}
                  </p>
                  <p className="text-sm text-gray-700 font-semibold mt-1">
                    Final Score: {student.final_score}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
