import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LuUserPlus,
  LuUser,
  LuBookOpen,
  LuClipboardCheck,
} from "react-icons/lu";
import AddStudent from "./AdminDashboardComponents/AddStudent";
import MarkUploadCheck from "./AdminDashboardComponents/MarkUploadCheck";
import AddTeacher from "./AdminDashboardComponents/AddTeacher";
import AssignSubject from "./AdminDashboardComponents/AssignSubject";

const AdminDashboard = () => {
  return (
    <>
      <div className="pt-20 font-sans bg-zinc-800 min-h-screen text-white">
        <ToastContainer
          enableMultiContainer
          containerId="main"
          position="top-right"
          autoClose={3000}
        />
        <Heading className="text-5xl font-semibold text-center text-purple-200 mb-15">
          Admin Dashboard
        </Heading>

        <div className="flex justify-center mt-5">
          <Tabs
            variant="solid-rounded"
            align="center"
            isFitted
            className="w-full max-w-5xl"
            isLazy={false} // <--- Important
          >
            <TabList className="flex gap-4 mb-8">
              <Tab color="white" className="flex items-center gap-2">
                <LuUserPlus /> Add Student
              </Tab>
              <Tab color="white" className="flex items-center gap-2">
                <LuUser /> Add Teacher
              </Tab>
              <Tab color="white" className="flex items-center gap-2">
                <LuBookOpen /> Assign Subject
              </Tab>
              <Tab color="white" className="flex items-center gap-2">
                <LuClipboardCheck /> Marks Check
              </Tab>
            </TabList>

            <TabPanels className="p-6 bg-white/5 rounded-lg shadow-md backdrop-blur-md">
              <TabPanel>
                <AddStudent />
              </TabPanel>
              <TabPanel>
                <AddTeacher />
              </TabPanel>
              <TabPanel>
                <AssignSubject />
              </TabPanel>
              <TabPanel>
                <MarkUploadCheck />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
