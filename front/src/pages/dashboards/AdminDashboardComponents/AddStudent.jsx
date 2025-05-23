import React, { useState } from "react";
import axios from "axios";
// import { toast } from "react-toastify";
import { Select, Input, Button, Heading } from "@chakra-ui/react";
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
      toast.warn("Please fill in all fields", { containerId: "main" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/add-students", {
        ...student,
        batch,
      });
      toast.success(res.data.message, { containerId: "main" });
      setStudent({ roll_number: "", name: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add student", {
        containerId: "main",
      });
    }
  };

  const fetchStudents = async () => {
    if (!batch) {
      toast.error("Please Select a Batch First", { containerId: "main" });

      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/fetch-students", {
        params: { batch },
      });
      setStudentsList(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch students", {
        containerId: "main",
      });
    }
  };

  return (
    <div className="flex flex-col gap-1 lg:flex-row">
      {/* Left Panel: Add Student Form */}
      <div className="w-full lg:w-1/2 bg-zinc-900 rounded-xl shadow-md p-6 ">
        <Heading className="text-4xl font-semibold text-center mb-4 ">
           Add New Student
        </Heading>

        <div className="mb-4">
          <label className="block  text-xl text-left font-medium mb-1">Batch</label>
          <Select
            value={batch}
            colorScheme="cyan"
            color={"gray.500"}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Batch</option>
            <option value="2022-2025">2022-2025</option>
            <option value="2023-2026">2023-2026</option>
            <option value="2024-2027">2024-2027</option>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xl text-left font-medium mb-1">Roll Number</label>
            <Input
              type="text"
              name="roll_number"
              value={student.roll_number}
              onChange={handleChange}
              placeholder="Enter roll number"
              className="w-full px-4 py-2  bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xl text-left font-medium mb-1">Name</label>
            <Input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4  bg-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block   text-xl  text-left font-medium mb-1">Password</label>
            <Input
              type="password"
              name="password"
              value={student.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              background="green.100"
              onClick={fetchStudents}
              className="w-1/2 bg-yellow-500 text-white  py-2 rounded-md hover:bg-yellow-600 transition duration-200"
            >
              📥 Fetch Students
            </Button>

            <Button
              type="submit"
              background="blue.100"
              className="w-1/2 bg-blue-600  py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              ➕ Add Student
            </Button>
          </div>
        </form>
      </div>

      {/* Right Panel: Student List */}
      <div className="w-full lg:w-1/2 bg-zinc-900 rounded-xl shadow-md p-6 bg-zinc-100">
        <h2 className="text-5xl font-semibold text-center mb-4 ">
          🧑‍🎓 Students in {batch || "Selected Batch"}
        </h2>
        {studentsList.length === 0 ? (
          <p className="text-center text-xl ">No students loaded</p>
        ) : (
          <ol className="max-h-[400px] scrollbar-hide overflow-y-auto text-left divide-y">
            {studentsList.map((stu) => (
              <li key={stu.student_roll_number} className="py-2">
                <span className="font-medium ">{stu.student_name}</span> — {"              "}
                <span className=" ">{stu.student_roll_number}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
