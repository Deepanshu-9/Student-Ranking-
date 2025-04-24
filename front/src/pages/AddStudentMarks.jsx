// import React, { useState } from "react";
// import axios from "axios";

// const AddStudentMarks = () => {
//   const [batch, setBatch] = useState("");
//   const [semester, setSemester] = useState("");
//   const [subject, setSubject] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [marksData, setMarksData] = useState({});
//   const [editableStudents, setEditableStudents] = useState({});
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const batches = ["2022-2025", "2023-2026", "2024-2027"];
//   const semesters = ["1", "2", "3", "4", "5", "6"];
//   const teacherData = JSON.parse(localStorage.getItem("user"));
//   const teacherEmail = teacherData?.teacher?.email;

//   const handleBatchChange = (e) => {
//     setBatch(e.target.value);
//     setStudents([]);
//     setMarksData({});
//     setSuccessMessage("");
//     setError("");
//   };

//   const handleSemesterChange = async (e) => {
//     const selectedSemester = e.target.value;
//     setSemester(selectedSemester);
//     setSubject("");
//     setSubjects([]);
//     setStudents([]);
//     setMarksData({});
//     setSuccessMessage("");
//     setError("");

//     try {
//       const res = await axios.get("http://localhost:5000/api/teacher-subjects-semesterwise", {
//         params: { teacher_email: teacherEmail, semester: selectedSemester },
//       });
//       setSubjects(res.data);
//     } catch (err) {
//       setError("Failed to fetch subjects.");
//     }
//   };

//   const handleSubjectChange = async (e) => {
//     const selectedSubject = e.target.value;
//     setSubject(selectedSubject);
//     setStudents([]);
//     setMarksData({});
//     setSuccessMessage("");
//     setError("");

//     try {
//       const res1 = await axios.get("http://localhost:5000/api/fetch-students", {
//         params: { batch },
//       });
//       const studentList = res1.data;
//       setStudents(studentList);

//       const res2 = await axios.get("http://localhost:5000/api/get-all-marks", {
//         params: { batch, semester, subject_name: selectedSubject },
//       });

//       const fetchedMarks = {};
//       res2.data.forEach((item) => {
//         fetchedMarks[item.student_roll_number] = {
//           internal_exam_1: item.internal_exam_1,
//           internal_exam_2: item.internal_exam_2,
//           external_exam: item.external_exam,
//           assignment: item.assignment,
//           attendance: item.attendance,
//           submitted: true,
//         };
//       });

//       studentList.forEach((student) => {
//         if (!fetchedMarks[student.student_roll_number]) {
//           fetchedMarks[student.student_roll_number] = {
//             internal_exam_1: "",
//             internal_exam_2: "",
//             external_exam: "",
//             assignment: "",
//             attendance: "",
//             submitted: false,
//           };
//         }
//       });

//       setMarksData(fetchedMarks);
//     } catch (err) {
//       setError("Failed to fetch marks or students.");
//     }
//   };

//   const handleInputChange = (rollNumber, field, value) => {
//     setMarksData((prev) => ({
//       ...prev,
//       [rollNumber]: {
//         ...prev[rollNumber],
//         [field]: value,
//       },
//     }));
//   };

//   const handleEdit = (rollNumber) => {
//     setEditableStudents((prev) => ({
//       ...prev,
//       [rollNumber]: true,
//     }));
//   };

//   const handleUpdate = async (student) => {
//     const data = marksData[student.student_roll_number];

//     if (
//       !data ||
//       data.internal_exam_1 === "" ||
//       data.internal_exam_2 === "" ||
//       data.external_exam === "" ||
//       data.assignment === "" ||
//       data.attendance === ""
//     ) {
//       alert("Please fill all fields for this student.");
//       return;
//     }

//     try {
//       const payload = {
//         student_roll_number: student.student_roll_number,
//         student_name: student.student_name,
//         subject_name: subject,
//         semester: semester,
//         internal_exam_1: Number(data.internal_exam_1),
//         internal_exam_2: Number(data.internal_exam_2),
//         external_exam: Number(data.external_exam),
//         assignment: Number(data.assignment),
//         attendance: Number(data.attendance),
//       };

//       const response = await axios.put("http://localhost:5000/api/update-marks", payload);

//       setSuccessMessage(`Marks updated for ${student.student_name}`);

//       setMarksData((prev) => ({
//         ...prev,
//         [student.student_roll_number]: {
//           ...prev[student.student_roll_number],
//           submitted: true,
//         },
//       }));

//       setEditableStudents((prev) => ({
//         ...prev,
//         [student.student_roll_number]: false,
//       }));
//     } catch (error) {
//       setError("Failed to update marks.");
//     }
//   };

//   const handleSubmit = async (student) => {
//     const data = marksData[student.student_roll_number];

//     if (
//       !data ||
//       data.internal_exam_1 === "" ||
//       data.internal_exam_2 === "" ||
//       data.external_exam === "" ||
//       data.assignment === "" ||
//       data.attendance === ""
//     ) {
//       alert("Please fill all fields for this student.");
//       return;
//     }

//     try {
//       const payload = {
//         student_roll_number: student.student_roll_number,
//         student_name: student.student_name,
//         subject_name: subject,
//         semester: semester,
//         internal_exam_1: Number(data.internal_exam_1),
//         internal_exam_2: Number(data.internal_exam_2),
//         external_exam: Number(data.external_exam),
//         assignment: Number(data.assignment),
//         attendance: Number(data.attendance),
//       };

//       const response = await axios.post("http://localhost:5000/api/add-marks", payload);

//       setSuccessMessage(`Marks submitted for ${student.student_name}`);

//       setMarksData((prev) => ({
//         ...prev,
//         [student.student_roll_number]: {
//           ...prev[student.student_roll_number],
//           submitted: true,
//         },
//       }));
//     } catch (error) {
//       setError("Failed to submit marks.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.header}>Add Student Marks</h2>

//       <div style={styles.formRow}>
//         <div style={styles.formGroup}>
//           <label style={styles.label}>Batch:</label>
//           <select value={batch} onChange={handleBatchChange} style={styles.select}>
//             <option value="">-- Select Batch --</option>
//             {batches.map((b, idx) => (
//               <option key={idx} value={b}>{b}</option>
//             ))}
//           </select>
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label}>Semester:</label>
//           <select value={semester} onChange={handleSemesterChange} style={styles.select}>
//             <option value="">-- Select Semester --</option>
//             {semesters.map((sem, idx) => (
//               <option key={idx} value={sem}>{sem}</option>
//             ))}
//           </select>
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label}>Subject:</label>
//           <select value={subject} onChange={handleSubjectChange} style={styles.select} disabled={!subjects.length}>
//             <option value="">-- Select Subject --</option>
//             {subjects.map((sub, idx) => (
//               <option key={idx} value={sub.subject_name}>{sub.subject_name}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {error && <p style={styles.error}>{error}</p>}
//       {successMessage && <p style={styles.success}>{successMessage}</p>}

//       {students.length > 0 && (
//         <div style={styles.box}>
//           <h4 style={styles.boxHeader}>Enter Marks</h4>
//           {students.map((student, idx) => {
//   const data = marksData[student.student_roll_number] || {};
//   const editable = editableStudents[student.student_roll_number];
//   const submitted = data.submitted;

//   const studentBoxStyle = {
//     ...styles.studentBox,
//     backgroundColor: submitted ? "#d4edda" : "#f9f9f9", // light green if submitted
//   };

//   return (
//     <div key={idx} style={studentBoxStyle}>
//       <div style={styles.info}>
//         <strong>{student.student_name}</strong> ({student.student_roll_number})
//       </div>

//       {["internal_exam_1", "internal_exam_2", "external_exam", "assignment", "attendance"].map((field) => (
//         <div style={styles.inputRow} key={field}>
//           <label style={{ width: "150px" }}>{field.replace(/_/g, " ")}:</label>
//           <input
//             type="number"
//             value={data[field] || ""}
//             onChange={(e) => handleInputChange(student.student_roll_number, field, e.target.value)}
//             disabled={submitted && !editable}
//             style={styles.input}
//           />
//         </div>
//       ))}

//       {submitted && !editable ? (
//         <button onClick={() => handleEdit(student.student_roll_number)} style={styles.editButton}>Edit</button>
//       ) : submitted && editable ? (
//         <button onClick={() => handleUpdate(student)} style={styles.updateButton}>Update</button>
//       ) : (
//         <button onClick={() => handleSubmit(student)} style={styles.submitButton}>Submit</button>
//       )}
//     </div>
//   );
// })}

//         </div>
//       )}
//     </div>
//   );
// };

// // Styles remain unchanged
// const styles = {
//   container: { padding: "20px", fontFamily: "Arial, sans-serif" },
//   header: { textAlign: "center" },
//   formRow: { display: "flex", gap: "20px" },
//   formGroup: { flex: 1 },
//   label: { display: "block", marginBottom: "8px", fontWeight: "bold" },
//   select: { width: "100%", padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" },
//   error: { color: "red", textAlign: "center" },
//   success: { color: "green", textAlign: "center" },
//   box: { marginTop: "30px" },
//   boxHeader: { fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" },
//   studentBox: { marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" },
//   info: { marginBottom: "10px" },
//   inputRow: { display: "flex", alignItems: "center", marginBottom: "1rem" },
//   input: { flex: 1, padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" },
//   editButton: { backgroundColor: "#ffa500", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" },
//   updateButton: { backgroundColor: "#4CAF50", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" },
//   submitButton: { backgroundColor: "#007BFF", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" },
// };

// export default AddStudentMarks;








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
    <div style={styles.container}>
      <ToastContainer />
      <h2 style={styles.header}>Add Student Marks</h2>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Batch:</label>
          <select value={batch} onChange={handleBatchChange} style={styles.select}>
            <option value="">-- Select Batch --</option>
            {batches.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Semester:</label>
          <select value={semester} onChange={handleSemesterChange} style={styles.select}>
            <option value="">-- Select Semester --</option>
            {semesters.map((sem, idx) => (
              <option key={idx} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Subject:</label>
          <select value={subject} onChange={handleSubjectChange} style={styles.select} disabled={!subjects.length}>
            <option value="">-- Select Subject --</option>
            {subjects.map((sub, idx) => (
              <option key={idx} value={sub.subject_name}>{sub.subject_name}</option>
            ))}
          </select>
        </div>
      </div>

      {students.length > 0 && (
        <div style={styles.box}>
          <h4 style={styles.boxHeader}>Enter Marks</h4>
          {students.map((student, idx) => {
            const data = marksData[student.student_roll_number] || {};
            const editable = editableStudents[student.student_roll_number];
            const submitted = data.submitted;

            const studentBoxStyle = {
              ...styles.studentBox,
              backgroundColor: submitted ? "#d4edda" : "#f9f9f9",
            };

            return (
              <div key={idx} style={studentBoxStyle}>
                <div style={styles.info}>
                  <strong>{student.student_name}</strong> ({student.student_roll_number})
                </div>

                <div style={styles.horizontalInputs}>
                  {["internal_exam_1", "internal_exam_2", "external_exam", "assignment", "attendance"].map((field) => (
                    <div style={styles.inputGroup} key={field}>
                      <label style={styles.inlineLabel}>{field.replace(/_/g, " ")}:</label>
                      <input
                        type="number"
                        value={data[field] || ""}
                        onChange={(e) => handleInputChange(student.student_roll_number, field, e.target.value)}
                        disabled={submitted && !editable}
                        style={styles.input}
                      />
                    </div>
                  ))}

                  {submitted && !editable ? (
                    <button onClick={() => handleEdit(student.student_roll_number)} style={styles.editButton}>Edit</button>
                  ) : submitted && editable ? (
                    <button onClick={() => handleUpdate(student)} style={styles.updateButton}>Update</button>
                  ) : (
                    <button onClick={() => handleSubmit(student)} style={styles.submitButton}>Submit</button>
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

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  header: { textAlign: "center" },
  formRow: { display: "flex", gap: "20px" },
  formGroup: { flex: 1 },
  label: { display: "block", marginBottom: "8px", fontWeight: "bold" },
  select: { width: "100%", padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" },
  box: { marginTop: "30px" },
  boxHeader: { fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" },
  studentBox: { marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" },
  info: { marginBottom: "10px" },
  horizontalInputs: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  inlineLabel: {
    fontWeight: "bold",
  },
  input: {
    width: "80px",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  editButton: { backgroundColor: "#ffa500", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" },
  updateButton: { backgroundColor: "#4CAF50", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" },
  submitButton: { backgroundColor: "#007BFF", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" },
};

export default AddStudentMarks;
