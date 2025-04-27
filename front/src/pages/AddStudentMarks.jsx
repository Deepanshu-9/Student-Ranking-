import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Heading, Input, Select } from "@chakra-ui/react";
import Hyperspeed from "../components/hyperSpeed";

const AddStudentMarks = () => {
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [editableStudents, setEditableStudents] = useState({});

  const batches = ["2022-2025", "2023-2026", "2024-2027"];
  const semesters = ["1", "2", "3", "4", "5", "6"];
  const teacherData = JSON.parse(localStorage.getItem("user"));
  const teacherEmail = teacherData?.teacher?.email;

  const handleBatchChange = (e) => {
    setBatch(e.target.value);
    setStudents([]);
    setMarksData({});
  };

  const handleSemesterChange = async (e) => {
    const selectedSemester = e.target.value;
    setSemester(selectedSemester);
    setSubject("");
    setSubjects([]);
    setStudents([]);
    setMarksData({});

    try {
      const res = await axios.get(
        "http://localhost:5000/api/teacher-subjects-semesterwise",
        {
          params: { teacher_email: teacherEmail, semester: selectedSemester },
        }
      );
      setSubjects(res.data);
    } catch {
      toast.error("Failed to fetch subjects.");
    }
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSubject(selectedSubject);
    setStudents([]);
    setMarksData({});

    try {
      const res1 = await axios.get("http://localhost:5000/api/fetch-students", {
        params: { batch },
      });
      const studentList = res1.data;
      setStudents(studentList);

      const res2 = await axios.get("http://localhost:5000/api/get-all-marks", {
        params: { batch, semester, subject_name: selectedSubject },
      });

      const fetchedMarks = {};
      res2.data.forEach((item) => {
        fetchedMarks[item.student_roll_number] = {
          internal_exam_1: item.internal_exam_1,
          internal_exam_2: item.internal_exam_2,
          external_exam: item.external_exam,
          assignment: item.assignment,
          attendance: item.attendance,
          submitted: true,
        };
      });

      studentList.forEach((student) => {
        if (!fetchedMarks[student.student_roll_number]) {
          fetchedMarks[student.student_roll_number] = {
            internal_exam_1: "",
            internal_exam_2: "",
            external_exam: "",
            assignment: "",
            attendance: "",
            submitted: false,
          };
        }
      });

      setMarksData(fetchedMarks);
    } catch {
      toast.error("Failed to fetch marks or students.");
    }
  };

  const handleInputChange = (rollNumber, field, value) => {
    const numValue = Number(value);

    if (field === "internal_exam_1" || field === "internal_exam_2") {
      if (numValue < 0 || numValue > 20) {
        toast.warn("Internal exam marks must be between 0 and 20");
        return;
      }
    } else if (field === "external_exam") {
      if (numValue < 0 || numValue > 50) {
        toast.warn("External exam marks must be between 0 and 50");
        return;
      }
    } else if (field === "assignment" || field === "attendance") {
      if (numValue < 0 || numValue > 5) {
        toast.warn(
          `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } score must be between 0 and 5`
        );
        return;
      }
    }

    setMarksData((prev) => ({
      ...prev,
      [rollNumber]: {
        ...prev[rollNumber],
        [field]: value,
      },
    }));
  };

  const handleEdit = (rollNumber) => {
    setEditableStudents((prev) => ({
      ...prev,
      [rollNumber]: true,
    }));
  };

  const handleUpdate = async (student) => {
    const data = marksData[student.student_roll_number];
    if (!data || Object.values(data).some((val) => val === "")) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      const payload = {
        student_roll_number: student.student_roll_number,
        student_name: student.student_name,
        subject_name: subject,
        semester,
        internal_exam_1: Number(data.internal_exam_1),
        internal_exam_2: Number(data.internal_exam_2),
        external_exam: Number(data.external_exam),
        assignment: Number(data.assignment),
        attendance: Number(data.attendance),
      };

      await axios.put("http://localhost:5000/api/update-marks", payload);
      toast.success(`Marks updated for ${student.student_name}`);

      setMarksData((prev) => ({
        ...prev,
        [student.student_roll_number]: {
          ...prev[student.student_roll_number],
          submitted: true,
        },
      }));

      setEditableStudents((prev) => ({
        ...prev,
        [student.student_roll_number]: false,
      }));
    } catch {
      toast.error("Failed to update marks.");
    }
  };

  const handleSubmit = async (student) => {
    const data = marksData[student.student_roll_number];
    if (!data || Object.values(data).some((val) => val === "")) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      const payload = {
        student_roll_number: student.student_roll_number,
        student_name: student.student_name,
        subject_name: subject,
        semester,
        internal_exam_1: Number(data.internal_exam_1),
        internal_exam_2: Number(data.internal_exam_2),
        external_exam: Number(data.external_exam),
        assignment: Number(data.assignment),
        attendance: Number(data.attendance),
      };

      await axios.post("http://localhost:5000/api/add-marks", payload);
      toast.success(`Marks submitted for ${student.student_name}`);

      setMarksData((prev) => ({
        ...prev,
        [student.student_roll_number]: {
          ...prev[student.student_roll_number],
          submitted: true,
        },
      }));
    } catch {
      toast.error("Failed to submit marks.");
    }
  };

  return (
    <>
      <Hyperspeed
        effectOptions={{
          onSpeedUp: () => {},
          onSlowDown: () => {},
          distortion: "turbulentDistortion",
          length: 400,
          roadWidth: 10,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
            sticks: 0x03b3c3,
          },
        }}
      />
      <div className="p-8 pt-20 font-sans bg-black min-h-screen text-white overflow-x-hidden">
        <ToastContainer />
        <Heading textAlign="center" size="2xl" mb="8" color="cyan.400">
          Add Student Marks
        </Heading>

        <div className="flex flex-wrap gap-6 mb-10">
          {/* Batch */}
          <div className="flex-1 min-w-[250px]">
            <label className="block mb-2 text-lg font-bold">Batch:</label>
            <Select
              placeholder="Select Batch"
              value={batch}
              onChange={handleBatchChange}
              bg="gray.700"
              color="white"
              _hover={{ bg: "cyan.600" }}
            >
              {batches.map((b, idx) => (
                <option key={idx} value={b} className="text-black">
                  {b}
                </option>
              ))}
            </Select>
          </div>

          {/* Semester */}
          <div className="flex-1 min-w-[250px]">
            <label className="block mb-2 text-lg font-bold">Semester:</label>
            <Select
              bg="gray.700"
              color="white"
              _hover={{ bg: "cyan.600" }}
              value={semester}
              onChange={handleSemesterChange}
              className="w-full p-3 rounded bg-cyan-700 text-white border border-cyan-400"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem, idx) => (
                <option key={idx} value={sem} className="text-black">
                  {sem}
                </option>
              ))}
            </Select>
          </div>

          {/* Subject */}
          <div className="flex-1 min-w-[250px]">
            <label className="block mb-2 text-lg font-bold">Subject:</label>
            <Select
              bg="gray.700"
              color="white"
              _hover={{ bg: "cyan.600" }}
              value={subject}
              onChange={handleSubjectChange}
              className="w-full p-3 rounded bg-cyan-700 text-white border border-cyan-400"
              disabled={!subjects.length}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub, idx) => (
                <option
                  key={idx}
                  value={sub.subject_name}
                  className="text-black"
                >
                  {sub.subject_name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Students */}
        {students.length > 0 && (
          <div>
            <Heading className="text-center text-4xl font-extrabold mb-10 text-white">
              Enter Marks
            </Heading>

            {students.map((student, idx) => {
              const data = marksData[student.student_roll_number] || {};
              const editable = editableStudents[student.student_roll_number];
              const submitted = data.submitted;

              return (
                <div
                  key={idx}
                  className="p-8 mb-8 rounded-3xl shadow-2xl backdrop-blur-md bg-white/20"
                  style={{
                    border: "1px solid",
                    borderColor: submitted ? "#9f7aea" : "#f56565", // purple-500 or red-500 hex colors
                  }}
                >
                  <div className="text-3xl font-bold mb-6 text-white ">
                    {student.student_name} ({student.student_roll_number})
                  </div>

                  <div className="flex flex-wrap gap-6 justify-between">
                    {[
                      "internal_exam_1",
                      "internal_exam_2",
                      "external_exam",
                      "assignment",
                      "attendance",
                    ].map((field) => (
                      <div key={field} className="flex flex-col w-40">
                        <label className="capitalize text-purple-300 mb-1">
                          {field.replace(/_/g, " ")}:
                        </label>
                        <Input
                          type="number"
                          value={data[field] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              student.student_roll_number,
                              field,
                              e.target.value
                            )
                          }
                          disabled={submitted && !editable}
                          className="p-2 rounded-lg bg-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                    ))}

                    <div className="flex items-end">
                      {submitted && !editable ? (
                        <Button
                          onClick={() =>
                            handleEdit(student.student_roll_number)
                          }
                          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 rounded-xl text-black font-bold transition"
                        >
                          Edit
                        </Button>
                      ) : submitted && editable ? (
                        <Button
                          onClick={() => handleUpdate(student)}
                          className="px-6 py-3 bg-green-400 hover:bg-green-300 rounded-xl text-black font-bold transition"
                        >
                          Update
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSubmit(student)}
                          className="px-6 py-3 bg-blue-400 hover:bg-blue-300 rounded-xl text-black font-bold transition"
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AddStudentMarks;
