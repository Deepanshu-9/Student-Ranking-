import React, { useState, useEffect } from "react";
import axios from "axios";
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
      alert("Failed to fetch teachers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacher.name || !teacher.email || !teacher.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/add-teachers", teacher);
      alert(res.data.message);
      setTeacher({ name: "", email: "", password: "" });
      fetchTeachers(); // refresh list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add teacher");
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/teachers/${email}`);
      alert(res.data.message);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete teacher");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-zinc-900 rounded-xl shadow-md p-6">
        <Heading className="text-2xl font-semibold text-center mb-6 text-gray-100 font-mono">
          Add New Teacher
        </Heading>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-100 font-medium mb-1">Name</label>
            <Input
              type="text"
              name="name"
              value={teacher.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-gray-100 font-medium mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={teacher.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-gray-100 font-medium mb-1">Password</label>
            <Input
              type="password"
              name="password"
              value={teacher.password}
              onChange={handleChange}
              placeholder="Enter password"
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
      <div className="w-full md:w-1/2 bg-zinc-900 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Teachers List</h2>
        <ul className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
          {teacherList.length > 0 ? (
            teacherList.map((t, index) => (
              <li
                key={index}
                className="p-3 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg shadow-lg hover:bg-white/20 transition-colors duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-20 rounded-2xl pointer-events-none"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-left font-medium text-gray-200">{t.name}</p>
                    <p className="text-xs text-left text-gray-300">{t.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(t.email)}
                    className="text-red-400 hover:text-red-600 text-xs font-bold ml-4"
                  >
                    Delete
                  </button>
                </div>
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
