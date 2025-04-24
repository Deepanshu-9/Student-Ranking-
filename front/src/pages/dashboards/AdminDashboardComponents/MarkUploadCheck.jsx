import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarkUploadCheck = () => {
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!batch || !semester) {
      toast.error("Please select both batch and semester");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/admin/check-marks-completeness", {
        params: { batch, semester },
      });

      setResult(res.data);
      if (res.data.status === "complete") {
        toast.success(res.data.message);
      } else {
        toast.warn(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong while checking");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Check Marks Upload Status</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            className="border rounded px-4 py-2 w-full"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          >
            <option value="">Select Batch</option>
            <option value="2022-2025">2022-2025</option>
            <option value="2023-2026">2023-2026</option>
            <option value="2024-2027">2024-2027</option>
          </select>

          <select
            className="border rounded px-4 py-2 w-full"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
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

        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handleCheck}
          >
            Check Upload Status
          </button>
        </div>

        {result && result.status === "incomplete" && (
  <div className="mt-8">
    <h2 className="text-lg font-semibold text-red-600 mb-2">Missing Entries</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-2 border">Roll No</th>
            <th className="p-2 border">Student Name</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {result.missing_entries.map((entry, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 border">{entry.roll_number}</td>
              <td className="p-2 border">{entry.student_name || entry.name}</td>
              <td className="p-2 border">{entry.subject_name}</td>
              <td className="p-2 border">{entry.teacher_name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default MarkUploadCheck;
