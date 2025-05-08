import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Heading, Input } from "@chakra-ui/react";

const AddTeacher = () => {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [teacherList, setTeacherList] = useState([]);

  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/get-teachers");
      setTeacherList(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacher.name || !teacher.email || !teacher.password) {
      toast.warn("Please fill in all fields", { containerId: "main" });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/add-teachers",
        teacher
      ); // ✅ Corrected endpoint
      toast.success(res.data.message, { containerId: "main" });
      setTeacher({ name: "", email: "", password: "" });
      fetchTeachers(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add teacher", {
        containerId: "main",
      });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 ">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-white rounded-xl shadow-md p-6 bg-zinc-900">
        <Heading className="text-2xl font-semibold text-center mb-6 text-gray-100 font-mono">
          Add New Teacher
        </Heading>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-100  font-medium mb-1">
              Name
            </label>
            <Input
              type="text"
              name="name"
              value={teacher.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-100 font-medium mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={teacher.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-100 font-medium mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={teacher.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Teacher
          </Button>
        </form>
      </div>

      {/* Teacher List Section */}
      <div className="w-full md:w-1/2 bg-zinc-900 rounded-xl shadow-md p-6 bg-zinc-100">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Teachers List
        </h2>
        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
          {teacherList.length > 0 ? (
            teacherList.map((t, index) => (
              <li
                key={index}
                className="p-3 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg
             hover:bg-white/20 transition-colors duration-300
             relative overflow-hidden"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.3)", // semi-transparent white border
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-20 rounded-2xl pointer-events-none"></div>
                <p className="text-sm font-medium text-gray-200">{t.name}</p>
                <p className="text-xs text-gray-300">{t.email}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No teachers found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddTeacher;
