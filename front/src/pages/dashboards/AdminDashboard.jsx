import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddStudent from "./AdminDashboardComponents/AddStudent";
import MarkUploadCheck from "./AdminDashboardComponents/MarkUploadCheck";
import AddTeacher from "./AdminDashboardComponents/AddTeacher";
import AssignSubject from "./AdminDashboardComponents/AssignSubject";
import {Heading,Button} from "@chakra-ui/react"
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addStudent");

  const renderTab = () => {
    switch (activeTab) {
      case "addStudent":
        return <AddStudent />;
      case "addTeacher":
        return <AddTeacher />;
      case "assignSubject":
        return <AssignSubject />;
      case "checkMarks":
        return <MarkUploadCheck />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-20   font-sans bg-zinc-800 min-h-screen">
      <ToastContainer />
      <Heading className="text-5xl font-semibold text-center text-purple-200 mb-8">
         Admin Dashboard
      </Heading>

      <div className="flex flex-wrap justify-center  gap-4 mb-8 mt-5">
        <Button
          className={`px-4 py-2 text-sm rounded border transition ${
            activeTab === "addStudent"
              ? "bg-teal-300 text-xl  border-blue-900"
              : "bg-white  text-xl  text-gray-800 border-gray-400 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("addStudent")}
        >
          Add Student
        </Button>

        <Button
          className={`px-4 py-2 text-sm rounded border transition ${
            activeTab === "addTeacher"
              ? "bg-blue-600 text-xl  text-white border-blue-600"
              : "bg-white text-xl  text-gray-800 border-gray-400 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("addTeacher")}
        >
          Add Teacher
        </Button>

        <Button
          className={`px-4 py-2 text-sm rounded border transition ${
            activeTab === "assignSubject"
              ? "bg-purple-300 text-xl   border-purple-800"
              : "bg-white text-xl  text-gray-800 border-gray-400 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("assignSubject")}
        >
          Assign Subject
        </Button>

        <Button
          className={`px-4 py-2 text-sm rounded border transition ${
            activeTab === "checkMarks"
              ? "bg-yellow-300 text-xl   border-zinc-300"
              : "bg-white text-xl  text-gray-800 border-gray-400 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("checkMarks")}
        >
          Marks Upload Check
        </Button>
      </div>

      <div className=" p-8 rounded-lg shadow-md transition-all">
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
