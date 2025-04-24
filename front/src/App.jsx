import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Privatecomp from "./components/Privatecomp";
import DashboardRouter from "./pages/DashboardRouter";
import AddStudentMarks from "./pages/AddStudentMarks"
import ResultDetail from "./pages/ResultDetail";
function AppWrapper() {
  const location = useLocation();
  const user = localStorage.getItem("user");

  // Only show Navbar if user is logged in and not on login page
  const showNavbar = user && location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={ <Privatecomp><HomePage /> </Privatecomp> }/>
        <Route path="/dashboard"  element={<Privatecomp> <DashboardRouter /> </Privatecomp>}/>    
        <Route path="/add-student-marks" element={<AddStudentMarks />} />  
        <Route path="/resultdetail/:rollNumber" element={<ResultDetail />} />



      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
