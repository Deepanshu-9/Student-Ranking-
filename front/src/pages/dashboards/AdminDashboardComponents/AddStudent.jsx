import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddStudent = () => {
  const [batch, setBatch] = useState(""); // shared batch
  const [student, setStudent] = useState({
    roll_number: "",
    name: "",
    password: "",
  });

  const [studentsList, setStudentsList] = useState([]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student.roll_number || !student.name || !student.password || !batch) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/add-students", {
        ...student,
        batch,
      });
      toast.success(res.data.message);
      setStudent({ roll_number: "", name: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add student");
    }
  };

  const fetchStudents = async () => {
    if (!batch) {
      toast.warn("Please select a batch first");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/fetch-students", {
        params: { batch },
      });
      setStudentsList(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch students");
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left Panel: Add Student Form */}
      <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-md p-6 bg-zinc-100">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          ➕ Add New Student
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Batch</label>
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Batch</option>
            <option value="2022-2025">2022-2025</option>
            <option value="2023-2026">2023-2026</option>
            <option value="2024-2027">2024-2027</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Roll Number</label>
            <input
              type="text"
              name="roll_number"
              value={student.roll_number}
              onChange={handleChange}
              placeholder="Enter roll number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={student.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={fetchStudents}
              className="w-1/2 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-200"
            >
              📥 Fetch Students
            </button>

            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              ➕ Add Student
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel: Student List */}
      <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-md p-6 bg-zinc-100">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          🧑‍🎓 Students in {batch || "Selected Batch"}
        </h2>
        {studentsList.length === 0 ? (
          <p className="text-center text-gray-500">No students loaded</p>
        ) : (
          <ul className="max-h-[400px] overflow-y-auto divide-y">
            {studentsList.map((stu) => (
              <li key={stu.student_roll_number} className="py-2">
                <span className="font-medium">{stu.student_name}</span> —{" "}
                <span className="text-gray-600">{stu.student_roll_number}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
