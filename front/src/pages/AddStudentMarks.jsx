import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      const res = await axios.get("http://localhost:5000/api/teacher-subjects-semesterwise", {
        params: { teacher_email: teacherEmail, semester: selectedSemester },
      });
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
  
    // Validation logic
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
        toast.warn(`${field.charAt(0).toUpperCase() + field.slice(1)} score must be between 0 and 5`);
        return;
      }
    }
  
    // If validation passes, update state
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
    <div className="p-5 font-sans bg-zinc-100  h-screen  w-screen">
      <ToastContainer />
      <h2 className="text-center text-7xl font-bold mb-5">Add Student Marks</h2>

      <div className="flex gap-5 mb-6 flex-wrap">
        <div className="flex-1">
          <label className="block mb-2  text-4xl font-semibold">Batch:</label>
          <select value={batch} onChange={handleBatchChange} className="w-full p-2 border  bg-zinc-900 text-purple-100 text-2xl border-gray-300 rounded">
            <option className="bg-zinc-900 text-purple-100" value="">-- Select Batch --</option>
            {batches.map((b, idx) => (
              <option className="bg-zinc-900 text-purple-100" key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-2  text-4xl font-semibold">Semester:</label>
          <select value={semester} onChange={handleSemesterChange} className="w-full  text-2xl bg-zinc-900 text-purple-100 p-2 border border-gray-300 rounded">
            <option className="bg-zinc-900 text-purple-100" value="">-- Select Semester --</option>
            {semesters.map((sem, idx) => (
              <option className="bg-zinc-900 text-purple-100" key={idx} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-2  text-4xl font-semibold">Subject:</label>
          <select  value={subject} onChange={handleSubjectChange} className="w-full bg-zinc-900 text-purple-100 text-2xl p-2 border border-gray-300 rounded" disabled={!subjects.length}>
            <option className="bg-zinc-900 text-purple-100" value="">-- Select Subject --</option>
            {subjects.map((sub, idx) => (
              <option  key={idx} value={sub.subject_name}>{sub.subject_name}</option>
            ))}
          </select>
        </div>
      </div>

      {students.length > 0 && (
        <div className="mt-10">
          <h4 className="text-5xl font-semibold text-center mb-6">Enter Marks</h4>
          {students.map((student, idx) => {
            const data = marksData[student.student_roll_number] || {};
            const editable = editableStudents[student.student_roll_number];
            const submitted = data.submitted;

            return (
              <div key={idx} className={`mb-6 p-5 rounded-xl border ${submitted ? "bg-zinc-900 border-purple-200" : "bg-zinc-700 text-black border-red-400"}`}>
                <div className="mb-3 text-3xl text-purple-100 font-semibold">
                  {student.student_name} ({student.student_roll_number})
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xl text-purple-100">
                  {["internal_exam_1", "internal_exam_2", "external_exam", "assignment", "attendance"].map((field) => (
                    <div className="flex items-center gap-2" key={field}>
                      <label className="font-medium capitalize">{field.replace(/_/g, " ")}:</label>
                      <input
                        type="number"
                        value={data[field] || ""}
                        onChange={(e) => handleInputChange(student.student_roll_number, field, e.target.value)}
                        disabled={submitted && !editable}
                        className="w-20 p-2 border border-gray-300 rounded"
                      />
                    </div>
                  ))}

                  {submitted && !editable ? (
                    <button onClick={() => handleEdit(student.student_roll_number)} className="bg-teal-400  px-4  text-black py-2 rounded hover:bg-teal-200">Edit</button>
                  ) : submitted && editable ? (
                    <button onClick={() => handleUpdate(student)} className="bg-purple-100 text-black px-4 py-2 rounded hover:bg-purple-300">Update</button>
                  ) : (
                    <button onClick={() => handleSubmit(student)} className="bg-blue-100  text-black px-4 py-2 rounded hover:bg-blue-200">Submit</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddStudentMarks;
