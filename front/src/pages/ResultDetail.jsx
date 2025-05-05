import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ResultDetail = () => {
  const location = useLocation();
  const { batch, semester, rollNumber, studentName } = location.state;

  const [subjects, setSubjects] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/subject-details", {
          params: { batch, semester, rollNumber, studentName },
        });
        setSubjects(res.data.subjects);
        setGrandTotal(res.data.grand_total);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch subject details.");
      }
    };

    fetchSubjectDetails();
  }, [batch, semester, rollNumber, studentName]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white mt-24 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Result Details</h1>
        <p><strong>Batch:</strong> {batch}</p>
        <p><strong>Semester:</strong> {semester}</p>
        <p><strong>Roll Number:</strong> {rollNumber}</p>
        <p><strong>Student Name:</strong> {studentName}</p>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Marks Table */}
        {subjects.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-purple-100 text-purple-700">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Subject</th>
                  <th className="border border-gray-300 px-4 py-2">Internal Exam 1</th>
                  <th className="border border-gray-300 px-4 py-2">Internal Exam 2</th>
                  <th className="border border-gray-300 px-4 py-2">External Exam</th>
                  <th className="border border-gray-300 px-4 py-2">Assignment</th>
                  <th className="border border-gray-300 px-4 py-2">Attendance</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{subject.subject_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.internal_exam_1}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.internal_exam_2}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.external_exam}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.assignment_score}</td>
                    <td className="border border-gray-300 px-4 py-2">{subject.attendance_score}</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold text-purple-600">{subject.subject_total_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Grand Total */}
            <div className="mt-4 text-right text-xl font-bold text-purple-800">
              Grand Total: {grandTotal}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDetail;
