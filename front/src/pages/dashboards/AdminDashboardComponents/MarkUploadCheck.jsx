import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Heading, Select } from "@chakra-ui/react";

const MarkUploadCheck = () => {
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [result, setResult] = useState(null);
  const [uploadedResult, setUploadedResult] = useState(null);

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
      setUploadedResult(null); // reset uploaded result
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

  const handleUploadedCheck = async () => {
    if (!batch || !semester) {
      toast.error("Please select both batch and semester");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/admin/check-marks-uploaded", {
        params: { batch, semester },
      });

      setUploadedResult(res.data);
      setResult(null); // reset missing result
      toast.success("Fetched uploaded entries successfully!");
    } catch (err) {
      toast.error("Something went wrong while fetching uploaded marks");
      console.error(err);
    }
  };

  return (
    <>
      <div className="min-h-screen rounded-xl bg-zinc-900 p-6">
      <ToastContainer/>
        <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-xl shadow">
          <Heading className="text-2xl font-bold text-center  mb-6" padding={"20px"}>
            Check Marks Upload Status
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Select
              bg="gray.800"
              color="white"
              borderColor="gray.600"
              _hover={{ borderColor: "cyan.500" }}
              _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #00bcd4" }}
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            >
              <option value="" style={{ backgroundColor: "#1a202c", color: "white" }}>Select Batch</option>
              <option value="2022-2025" style={{ backgroundColor: "#1a202c", color: "white" }}>2022-2025</option>
              <option value="2023-2026" style={{ backgroundColor: "#1a202c", color: "white" }}>2023-2026</option>
              <option value="2024-2027" style={{ backgroundColor: "#1a202c", color: "white" }}>2024-2027</option>
            </Select>

            <Select
              bg="gray.800"
              color="white"
              borderColor="gray.600"
              _hover={{ borderColor: "cyan.500" }}
              _focus={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px #00bcd4" }}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="" style={{ backgroundColor: "#1a202c", color: "white" }}>Select Semester</option>
              <option value="1" style={{ backgroundColor: "#1a202c", color: "white" }}>Semester 1</option>
              <option value="2" style={{ backgroundColor: "#1a202c", color: "white" }}>Semester 2</option>
              <option value="3" style={{ backgroundColor: "#1a202c", color: "white" }}>Semester 3</option>
              <option value="4" style={{ backgroundColor: "#1a202c", color: "white" }}>Semester 4</option>
              <option value="5" style={{ backgroundColor: "#1a202c", color: "white" }}>Semester 5</option>
              <option value="6" style={{ backgroundColor: "#1a202c", color: "white" }}>Semester 6</option>
            </Select>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleCheck}
            >
              Check Missing Marks
            </Button>
            <Button
              className="bg-green-200 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={handleUploadedCheck}
            >
              Check Uploaded Marks
            </Button>
          </div>

          {/* Missing Entries Table */}
          {result && result.status === "incomplete" && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-red-200 mb-2">Missing Entries</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-800 text-left">
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

          {/* Uploaded Entries Table */}
          {uploadedResult && uploadedResult.status === "uploaded" && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-green-600 mb-2">Uploaded Marks</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-800 text-left">
                    <tr>
                      <th className="p-2 border">Roll No</th>
                      <th className="p-2 border">Student Name</th>
                      <th className="p-2 border">Subject</th>
                      <th className="p-2 border">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedResult.uploaded_entries.map((entry, index) => (
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
    </>
  );
};

export default MarkUploadCheck;
