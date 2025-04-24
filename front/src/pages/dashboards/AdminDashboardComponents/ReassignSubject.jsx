import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReassignSubject = () => {
  const [assigned, setAssigned] = useState({});
  const [unassigned, setUnassigned] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  useEffect(() => {
    fetchAssigned();
    fetchUnassigned();
  }, []);

  const fetchAssigned = () => {
    axios.get("http://localhost:5000/api/get-teacher-subjects")
      .then((res) => {
        const grouped = res.data.reduce((acc, curr) => {
          if (!acc[curr.teacher_name]) acc[curr.teacher_name] = [];
          acc[curr.teacher_name].push(curr);
          return acc;
        }, {});
        setAssigned(grouped);
      })
      .catch(() => toast.error("Failed to fetch assigned subjects"));
  };

  const fetchUnassigned = () => {
    axios.get("http://localhost:5000/get-unassigned-subjects")
      .then((res) => setUnassigned(res.data))
      .catch(() => toast.error("Failed to fetch unassigned subjects"));
  };

  const handleUnassign = async (teacherEmail, subjectCode) => {
    try {
      await axios.post("http://localhost:5000/api/unassign-teacher", {
        teacher_email: teacherEmail,
        subject_codes: [subjectCode],
      });
      toast.success("Subject unassigned successfully");
      fetchAssigned();
      fetchUnassigned();
    } catch {
      toast.error("Unassignment failed");
    }
  };

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const res = await axios.get("http://localhost:5000/api/get-teachers");
      setTeachers(res.data);
    } catch {
      toast.error("Failed to fetch teachers");
    } finally {
      setLoadingTeachers(false);
    }
  };

  const toggleDropdown = async (subjectCode) => {
    if (!dropdownVisible[subjectCode]) await fetchTeachers();
    setDropdownVisible(prev => ({
      ...prev,
      [subjectCode]: !prev[subjectCode],
    }));
  };

  const handleAssign = async (teacherEmail, subjectCode) => {
    if (!teacherEmail) return;

    try {
      const res = await axios.post("http://localhost:5000/api/assign-teacher", {
        teacher_email: teacherEmail,
        subject_code: subjectCode,
      });
      toast.success(res.data.message);
      fetchAssigned();
      fetchUnassigned();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Reassign Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">

        {/* Assigned Subjects */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Assigned Subjects</h2>
          {Object.entries(assigned).map(([teacher, subjects], idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-2">{teacher}</h3>
              <ul className="space-y-2">
                {subjects.map((subj, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded border text-sm">
                    <span>{subj.subject_name} (Sem {subj.semester})</span>
                    <button
                      onClick={() => handleUnassign(subj.teacher_email, subj.subject_code)}
                      className="text-red-600 text-xs font-semibold hover:underline"
                    >
                      Unassign
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Unassigned Subjects */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Unassigned Subjects</h2>
          <ul className="text-sm space-y-4">
            {unassigned.map((subj, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-center">
                  <span>{subj.name} ({subj.subject_code}) - Sem {subj.semester}</span>
                  <button
                    onClick={() => toggleDropdown(subj.subject_code)}
                    className="text-blue-600 text-xs font-semibold hover:underline"
                  >
                    {dropdownVisible[subj.subject_code] ? "Hide" : "Assign"}
                  </button>
                </div>
                {dropdownVisible[subj.subject_code] && (
                  <div className="mt-2">
                    {loadingTeachers ? (
                      <p className="text-xs text-gray-500 italic">Loading teachers...</p>
                    ) : (
                      <select
                        className="w-full border px-2 py-1 text-sm rounded mt-1"
                        onChange={(e) => handleAssign(e.target.value, subj.subject_code)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.email} value={teacher.email}>
                            {teacher.name} ({teacher.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ReassignSubject;
