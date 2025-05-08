const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());



// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mysql@9759", // Change this to your actual MySQL password
  database: "project"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ------------------------ STUDENT FUNCTIONALITY ------------------------
// Student Login
app.post("/api/student/login", (req, res) => {
  const { roll_number, password } = req.body;
  const query = "SELECT roll_number, name, batch FROM student WHERE roll_number = ? AND password = ?";
  db.query(query, [roll_number, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", student: results[0] });
  });
});




// api for rank fetching 
app.get("/api/rankings", (req, res) => {
  const { batch, semester } = req.query;

  if (!batch || !semester) {
    return res.status(400).json({ error: "Batch and semester are required" });
  }

  const query = `
    SELECT
      p.student_roll_number,
      s.name AS student_name,
      SUM(p.subject_total_score) AS final_score,
      RANK() OVER (ORDER BY SUM(p.subject_total_score) DESC) AS \`rank\`
    FROM performance p
    JOIN student s ON p.student_roll_number = s.roll_number
    WHERE s.batch = ? AND p.semester = ?
    GROUP BY p.student_roll_number
  `;

  db.query(query, [batch, semester], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



// API to fetch student details based on roll number 
app.get("/api/studentdetails", (req, res) => {
  const rollNumber = req.headers['rollnumber'];  // Fetch roll number from request headers

  if (!rollNumber) {
    return res.status(400).json({ error: "Roll number is required in the header." });
  }

  // Query to fetch student details based on roll number
  const query = `
    SELECT * 
    FROM student 
    WHERE roll_number = ?
  `;

  db.query(query, [rollNumber], (err, results) => {
    if (err) {
      // console.error("Error fetching student details:", err);
      return res.status(500).json({ error: "Failed to fetch student details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json(results[0]);  // Send back the first result
  });
});

// API to get result details for a particular student
app.get("/api/student/subject-details", (req, res) => {
  const { batch, semester, rollNumber, studentName } = req.query;

  if (!batch || !semester || !rollNumber || !studentName) {
    return res.status(400).json({ error: "Batch, semester, roll number, and student name are required" });
  }

  const query = `
    SELECT 
      s.roll_number AS student_roll_number,
      s.name AS student_name,
      p.subject_name, 
      p.internal_exam_1, 
      p.internal_exam_2, 
      p.external_exam, 
      p.assignment_score, 
      p.attendance_score, 
      p.subject_total_score
    FROM performance p
    JOIN student s ON p.student_roll_number = s.roll_number
    WHERE p.student_roll_number = ? AND p.semester = ? AND s.batch = ? AND s.name = ?
  `;

  db.query(query, [rollNumber, semester, batch, studentName], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No performance data found for this student" });
    }

    // Calculate Grand Total
    const grandTotal = results.reduce((acc, curr) => acc + curr.subject_total_score, 0);

    res.json({
      student: results[0],  // Since it's the same student for all subjects, we can take details from the first row
      subjects: results,
      grand_total: grandTotal,
    });
  });
});




// ------------------------ TEACHER FUNCTIONALITY ------------------------
// Teacher Login
app.post("/api/teacher/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT email, name FROM teacher WHERE email = ? AND password = ?"; // Exclude password
  
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", teacher: results[0] });
  });
});




// Fetch Students: this api help teachers to fetch students of particular year for assigning marks
app.get("/api/fetch-students", (req, res) => {
  const { batch } = req.query;
  if (!batch) {
    return res.status(400).json({ error: "Batch is required" });
  }
  console.log("Received batch:", batch); // Log the batch
  const query = `SELECT roll_number AS student_roll_number, name AS student_name FROM student WHERE batch = CAST(? AS CHAR)`;
  db.query(query, [batch], (err, results) => {
    if (err) {
      // console.error("Database Error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // console.log("Query results:", results); // Log query results
    res.json(results);
  });
});



//api to fetch teacher subjects
app.get("/api/teacher-subjects", (req, res) => {
  const { teacher_email } = req.query;

  const query = `
    SELECT sub.subject_code, sub.name AS subject_name, sub.semester
    FROM teacher_subject_mapping tsm
    JOIN subject sub ON tsm.subject_code = sub.subject_code
    WHERE tsm.teacher_email = ?
  `;

  db.query(query, [teacher_email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If no results found, send a message indicating no subjects assigned.
    if (results.length === 0) {
      return res.status(404).json({ message: "No subjects assigned to this teacher." });
    }

    res.json(results); // Returns subjects with subject code, name, and semester
  });
});



//api to get teacher subjects according to semester 
app.get("/api/teacher-subjects-semesterwise", (req, res) => {
  const { teacher_email, semester } = req.query;

  const query = `
    SELECT sub.subject_code, sub.name AS subject_name, sub.semester
    FROM teacher_subject_mapping tsm
    JOIN subject sub ON tsm.subject_code = sub.subject_code
    WHERE tsm.teacher_email = ? AND sub.semester = ?
  `;

  db.query(query, [teacher_email, semester], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


app.get("/api/get-all-marks", (req, res) => {
  const { batch, semester, subject_name } = req.query;

  if (!batch || !semester || !subject_name) {
    return res.status(400).json({ error: "Missing batch, semester, or subject_name in query params." });
  }

  const query = `
    SELECT 
      p.student_roll_number,
      p.student_name,
      p.internal_exam_1,
      p.internal_exam_2,
      p.external_exam,
      p.assignment_score,
      p.attendance_score
    FROM performance p
    JOIN student s ON p.student_roll_number = s.roll_number
    WHERE s.batch = ? AND p.semester = ? AND p.subject_name = ?
  `;

  db.query(query, [batch, semester, subject_name], (err, results) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // No transformation of assignment and attendance, return raw scores
    const transformed = results.map(row => {
      return {
        student_roll_number: row.student_roll_number,
        student_name: row.student_name,
        internal_exam_1: row.internal_exam_1,
        internal_exam_2: row.internal_exam_2,
        external_exam: row.external_exam,
        assignment: row.assignment_score,
        attendance: row.attendance_score
      };
    });

    res.json(transformed);
  });
});


// API to add student marks 
app.post("/api/add-marks", (req, res) => {
  const { 
    student_roll_number, 
    student_name, 
    subject_name, 
    semester, 
    internal_exam_1, 
    internal_exam_2, 
    external_exam, 
    assignment, 
    attendance 
  } = req.body;

  // Check for missing required fields
  if (!student_roll_number || !student_name || !subject_name || !semester || 
      internal_exam_1 === undefined || internal_exam_2 === undefined || 
      external_exam === undefined || assignment === undefined || attendance === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate the total score for the subject
  const subject_total_score = internal_exam_1 + internal_exam_2 + external_exam + assignment + attendance;

  // Insert marks into the performance table
  const insertQuery = `
    INSERT INTO performance 
    (student_roll_number, student_name, subject_name, semester, internal_exam_1, internal_exam_2, external_exam, assignment_score, attendance_score, subject_total_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [
    student_roll_number, student_name, subject_name, semester, 
    internal_exam_1, internal_exam_2, external_exam, assignment, attendance, subject_total_score
  ], (err) => {
    if (err) {
      console.error("Database error:", err);  // Log the error for debugging
      return res.status(500).json({ error: "An error occurred while adding marks", details: err.message });
    }

    res.status(201).json({ message: "Marks added successfully" });
  });
});



//api to update student marks 
app.put("/api/update-marks", (req, res) => {
  const {
    student_roll_number,
    student_name,
    subject_name,
    semester,
    internal_exam_1,
    internal_exam_2,
    external_exam,
    assignment,
    attendance
  } = req.body;

  // Check for missing required fields
  if (!student_roll_number || !student_name || !subject_name || !semester ||
      internal_exam_1 === undefined || internal_exam_2 === undefined ||
      external_exam === undefined || assignment === undefined || attendance === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate total score
  const subject_total_score =
    internal_exam_1 + internal_exam_2 + external_exam + assignment + attendance;

  const updateQuery = `
    UPDATE performance 
    SET student_name = ?, internal_exam_1 = ?, internal_exam_2 = ?, external_exam = ?, 
        assignment_score = ?, attendance_score = ?, subject_total_score = ? 
    WHERE student_roll_number = ? AND subject_name = ? AND semester = ?
  `;

  db.query(
    updateQuery,
    [
      student_name,
      internal_exam_1,
      internal_exam_2,
      external_exam,
      assignment,
      attendance,
      subject_total_score,
      student_roll_number,
      subject_name,
      semester
    ],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "An error occurred while updating marks", details: err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }

      res.json({ message: "Marks updated successfully" });
    }
  );
});






// ------------------------ ADMIN FUNCTIONALITY ------------------------

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT email, name FROM admin WHERE email = ? AND password = ?";
  
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", admin: results[0] });
  });
});



// Add Student
app.post("/api/add-students", (req, res) => {
  const { roll_number, name, password, batch } = req.body;
  const query = "INSERT INTO student (roll_number, name, password, batch) VALUES (?, ?, ?, ?)";
  
  db.query(query, [roll_number, name, password, batch], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student added successfully" });
  });
});

// Add Teacher
app.post("/api/add-teachers", (req, res) => {
  const { email, name, password } = req.body;
  const query = "INSERT INTO teacher (email, name, password) VALUES (?, ?, ?)";
  
  db.query(query, [email, name, password], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Teacher added successfully" });
  });
});


// GET all teachers
app.get('/api/get-teachers', (req, res) => {
  const query = `SELECT email, name FROM teacher`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching teachers:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});


// Delete Teacher
app.delete("/api/teachers/:email", (req, res) => {
  const { email } = req.params;
  const query = "DELETE FROM teacher WHERE email = ?";
  
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
  });
});



// API to fetch all subjects ordered by semester and subject_code
app.get("/get-all-subjects", (req, res) => {
  const query = "SELECT * FROM subject ORDER BY semester ASC, subject_code ASC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching subjects:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json(results);
  });
});


// API to get all unassigned subjects
app.get("/get-unassigned-subjects", (req, res) => {
  const query = `
    SELECT s.subject_code, s.name, s.semester
    FROM subject s
    LEFT JOIN teacher_subject_mapping tsm
    ON s.subject_code = tsm.subject_code
    WHERE tsm.subject_code IS NULL
    ORDER BY s.semester ASC, s.subject_code ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching unassigned subjects:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json(results);
  });
});



// GET: Get teacher assigned to subjects
app.get('/api/get-teacher-subjects', (req, res) => {
  const query = `
    SELECT 
      t.name AS teacher_name,
      t.email AS teacher_email,      -- Added teacher email
      s.name AS subject_name,
      s.subject_code,                -- Added subject code
      s.semester
    FROM 
      teacher_subject_mapping tsm
    JOIN 
      teacher t ON tsm.teacher_email = t.email
    JOIN 
      subject s ON tsm.subject_code = s.subject_code
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching teacher-subject assignments:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the results as a response
    res.json(results);
  });
});




// Assign Teacher to Subject
app.post("/api/assign-teacher", (req, res) => {
  const { teacher_email, subject_code } = req.body;

  if (!teacher_email || !subject_code) {
    return res.status(400).json({ message: "Teacher email and subject code are required" });
  }

  // Step 1: Check if the subject is already assigned to a teacher
  const checkSubjectQuery = `
    SELECT t.name, t.email 
    FROM teacher_subject_mapping tsm
    JOIN teacher t ON tsm.teacher_email = t.email
    WHERE tsm.subject_code = ?`;

  db.query(checkSubjectQuery, [subject_code], (err, subjectResults) => {
    if (err) return res.status(500).json({ error: err.message });

    if (subjectResults.length > 0) {
      return res.status(400).json({
        message: "This subject is already assigned to another teacher",
        assigned_teacher: subjectResults[0] // Returns the teacher's details
      });
    }

    // Step 2: Assign the subject to the teacher
    const assignQuery = "INSERT INTO teacher_subject_mapping (teacher_email, subject_code) VALUES (?, ?)";

    db.query(assignQuery, [teacher_email, subject_code], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Teacher assigned to subject successfully" });
    });
  });
});





//api to unassign teacher for a particular subjects
app.post("/api/unassign-teacher", (req, res) => {
  const { teacher_email, subject_codes } = req.body;

  if (!subject_codes || subject_codes.length === 0) {
    return res.status(400).json({ message: "No subject codes provided" });
  }

  const query = `DELETE FROM teacher_subject_mapping 
                 WHERE teacher_email = ? 
                 AND subject_code IN (${subject_codes.map(() => "?").join(",")})`;

  db.query(query, [teacher_email, ...subject_codes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "No records found to delete" });

    res.json({ message: "Subjects unassigned from teacher successfully" });
  });
});



//api to reassign teachers to particular subject 
app.put("/api/update-teacher-subject", (req, res) => {
  const { old_teacher_email, new_teacher_email, subject_code } = req.body;

  // Check if the subject is already assigned to another teacher
  const checkQuery = `SELECT teacher_email FROM teacher_subject_mapping WHERE subject_code = ?`;

  db.query(checkQuery, [subject_code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0 && results[0].teacher_email !== old_teacher_email) {
      return res.status(400).json({ message: "This subject is already assigned to another teacher" });
    }

    // Update the teacher for the subject
    const updateQuery = `UPDATE teacher_subject_mapping 
                         SET teacher_email = ? 
                         WHERE teacher_email = ? AND subject_code = ?`;

    db.query(updateQuery, [new_teacher_email, old_teacher_email, subject_code], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }

      res.json({ message: "Teacher updated successfully for the subject" });
    });
  });
});



// Process and Update Final Scores
app.post("/api/update-final-scores", (req, res) => {
  const query = `
    INSERT INTO final_score (student_roll_number, batch, semester, final_score)
    SELECT p.student_roll_number, s.batch, p.semester, SUM(p.subject_total_score)
    FROM performance p
    JOIN student s ON p.student_roll_number = s.roll_number
    GROUP BY p.student_roll_number, s.batch, p.semester
    ON DUPLICATE KEY UPDATE final_score = VALUES(final_score);
  `;

  db.query(query, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Final scores updated successfully" });
  });
});





// aPI to check student whose marks are not uploaed  .
app.get("/api/admin/check-marks-completeness", (req, res) => {
  const { batch, semester } = req.query;

  if (!batch || !semester) {
    return res.status(400).json({ error: "Batch and semester are required" });
  }

  const query = `
    SELECT 
      s.roll_number,
      s.name AS student_name,
      sub.name AS subject_name,
      t.name AS teacher_name,
      p.student_roll_number IS NOT NULL AS data_present
    FROM student s
    JOIN subject sub ON sub.semester = ?
    LEFT JOIN teacher_subject_mapping tsm ON tsm.subject_code = sub.subject_code
    LEFT JOIN teacher t ON t.email = tsm.teacher_email
    LEFT JOIN performance p 
      ON p.student_roll_number = s.roll_number 
      AND p.subject_name = sub.name
      AND p.semester = ?
    WHERE s.batch = ?
    ORDER BY s.roll_number, sub.name
  `;

  db.query(query, [semester, semester, batch], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    let missingEntries = results.filter(row => !row.data_present);

    if (missingEntries.length > 0) {
      return res.json({
        status: "incomplete",
        message: "Some subjects are missing marks for students",
        missing_entries: missingEntries
      });
    } else {
      return res.json({
        status: "complete",
        message: "All subject marks are properly uploaded for this batch and semester"
      });
    }
  });
});



//api to check student whose marks are uploaded
app.get("/api/admin/check-marks-uploaded", (req, res) => {
  const { batch, semester } = req.query;

  if (!batch || !semester) {
    return res.status(400).json({ error: "Batch and semester are required" });
  }

  const query = `
    SELECT 
      s.roll_number,
      s.name AS student_name,
      sub.name AS subject_name,
      t.name AS teacher_name,
      p.student_roll_number IS NOT NULL AS data_present
    FROM student s
    JOIN subject sub ON sub.semester = ?
    LEFT JOIN teacher_subject_mapping tsm ON tsm.subject_code = sub.subject_code
    LEFT JOIN teacher t ON t.email = tsm.teacher_email
    LEFT JOIN performance p 
      ON p.student_roll_number = s.roll_number 
      AND p.subject_name = sub.name
      AND p.semester = ?
    WHERE s.batch = ?
    ORDER BY s.roll_number, sub.name
  `;

  db.query(query, [semester, semester, batch], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Filter to get only entries where marks are uploaded (data is present)
    let uploadedEntries = results.filter(row => row.data_present);

    return res.json({
      status: "uploaded",
      message: "Subjects with uploaded marks for this batch and semester",
      uploaded_entries: uploadedEntries
    });
  });
});





// ------------------------ SERVER START ------------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

