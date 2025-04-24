import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      {/* Left: Dashboard */}
      <div className="text-lg font-semibold cursor-pointer" onClick={() => navigate("/dashboard")}>
        Dashboard
      </div>

      {/* Center: Upcoming Events & Request to Admin */}
      <div className="flex space-x-6 text-sm font-medium">
        <button onClick={() => navigate("/events")} className="hover:text-yellow-300 transition">
          Upcoming Events
        </button>
        <button onClick={() => navigate("/home")} className="hover:text-yellow-300 transition">
          Home
        </button>
        <button onClick={() => navigate("/request-admin")} className="hover:text-yellow-300 transition">
          Request to Admin
        </button>
      </div>

      {/* Right: Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-white text-purple-600 px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
