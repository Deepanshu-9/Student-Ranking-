import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-zinc-900 text-purple-100 px-6 py-4 shadow-md flex items-center justify-between">
      {/* Left: Dashboard */}
      <div className="text-2xl font-semibold cursor-pointer hover:text-teal-100 transition" onClick={() => navigate("/dashboard")}>
        Dashboard
      </div>

      {/* Center: Upcoming Events & Request to Admin */}
      <div className="flex space-x-6 text-lg font-medium">
        <button onClick={() => navigate("/events")} className="hover:text-teal-100  transition">
          Upcoming Events
        </button>
        <button onClick={() => navigate("/home")} className="hover:text-teal-100 transition">
          Home
        </button>
        <button onClick={() => navigate("/request-admin")} className="hover:text-teal-100 transition">
          Request to Admin
        </button>
      </div>

      {/* Right: Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-zinc-700 text-purple-200 px-4 py-1 rounded-2xl font-medium hover:text-teal-100 bg-zinc-500 transition "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
