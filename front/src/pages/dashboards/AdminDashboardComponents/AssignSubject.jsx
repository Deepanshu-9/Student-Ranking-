import React, { useEffect, useState } from "react";
import axios from "axios";
import ReassignSubject from "./ReassignSubject";
import { Heading, Button } from "@chakra-ui/react";

const AssignSubject = () => {
  const [assignments, setAssignments] = useState([]);
  const [showReassign, setShowReassign] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-teacher-subjects")
      .then((res) => {
        const grouped = res.data.reduce((acc, curr) => {
          if (!acc[curr.teacher_name]) {
            acc[curr.teacher_name] = [];
          }
          acc[curr.teacher_name].push({
            subject: curr.subject_name,
            semester: curr.semester,
          });
          return acc;
        }, {});
        setAssignments(grouped);
      })
      .catch((err) => {
        console.error("Error fetching teacher-subject assignments:", err);
      });
  }, []);

  if (showReassign) return <ReassignSubject />;

  return (
    <div className="min-h-screen rounded-xl bg-zinc-900 p-6">
      <div className="flex justify-between rounded-xl items-center mb-6 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold ">
          Teacher Subject Mapping
        </h1>
        <Button
          onClick={() => setShowReassign(true)}
          className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Reassign Subjects
        </Button>
      </div>

      <div className="grid rounded-xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {Object.entries(assignments).map(([teacher, subjects], index) => {
          const sortedSubjects = [...subjects].sort(
            (a, b) => a.semester - b.semester
          );
          return (
            <div
              key={index}
              className="bg-zinc-800 rounded-xl text-left  rounded shadow p-4 border-l-4 border-blue-500"
            >
              <span className="text-3xl text-left  font-semibold  mb-20">
                {teacher}
              </span>
              <ul className="space-y-1 text-semibold  mt-25 text-sm">
                {sortedSubjects.map((subj, i) => (
                  <li key={i} className=" text-start">
                    {subj.subject}{" "}
                    <span className=" text-center">
                      (Sem {subj.semester})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignSubject;
