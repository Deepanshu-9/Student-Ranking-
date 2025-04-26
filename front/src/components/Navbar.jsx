import { Button } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false); // Prevent multiple state updates from multiple scroll events

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Handle scroll event
  const handleScroll = () => {
    if (ticking.current) return; // Prevents unnecessary state updates during fast scrolling

    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      // If scrolling down, hide the navbar
      if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        // If scrolling up, show the navbar
        setShowNavbar(true);
      }

      // Update the last scroll position
      lastScrollY.current = currentScrollY;
      ticking.current = false; // Allow further state updates
    });

    ticking.current = true;
  };

  // Add scroll event listener on mount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${
        showNavbar ? "top-0" : "-top-20" // toggle the navbar visibility
      } z-20 fixed w-full bg-[#62b6cb] text-purple-100 px-6 py-4 shadow-md flex items-center justify-between transition-all duration-300 ease-in-out`}
    >
      {/* Left: Dashboard */}
      <div
        className="text-2xl font-semibold cursor-pointer hover:text-teal-100 transition"
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </div>

      {/* Center: Upcoming Events & Request to Admin */}
      <div className="flex space-x-6 text-lg font-medium">
        <button
          onClick={() => navigate("/events")}
          className="hover:text-teal-100 transition"
        >
          Upcoming Events
        </button>
        <button
          onClick={() => navigate("/home")}
          className="hover:text-teal-100 transition"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/request-admin")}
          className="hover:text-teal-100 transition"
        >
          Request to Admin
        </button>
      </div>

      {/* Right: Logout */}
      <div>
        <Button
          variant="outline"
          colorScheme="teal"
          color={"blue"}
          onClick={handleLogout}
          className="bg-zinc-700 text-purple-200 px-4 py-1 rounded-2xl font-medium hover:text-teal-100 bg-zinc-500 transition"
        >
          Logout
          
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
