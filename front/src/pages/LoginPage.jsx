import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState(""); // student | teacher | admin
  const [credentials, setCredentials] = useState({});
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    let endpoint = "";
    let payload = {};

    if (loginType === "student") {
      endpoint = "http://localhost:5000/api/student/login";
      payload = {
        roll_number: credentials.roll_number,
        password: credentials.password,
      };
    } else if (loginType === "teacher") {
      endpoint = "http://localhost:5000/api/teacher/login";
      payload = {
        email: credentials.email,
        password: credentials.password,
      };
    } else if (loginType === "admin") {
      endpoint = "http://localhost:5000/api/admin/login";
      payload = {
        email: credentials.admin_id, // use admin_id for admin login
        password: credentials.password,
      };
    }

    try {
      const res = await axios.post(endpoint, payload);
      if (res.data.student || res.data.teacher || res.data.admin) {
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("userType", loginType); // Save user type
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {!loginType ? (
          <>
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
              Login As
            </h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setLoginType("student")}
                className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Student
              </button>
              <button
                onClick={() => setLoginType("teacher")}
                className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
              >
                Teacher
              </button>
              <button
                onClick={() => setLoginType("admin")}
                className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                Admin
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-6 capitalize">
              {loginType} Login
            </h2>

            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            {loginType === "student" && (
              <>
                <label className="block mb-2 text-purple-600 font-semibold">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={credentials.roll_number || ""}
                  onChange={(e) =>
                    handleInputChange("roll_number", e.target.value)
                  }
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </>
            )}

            {loginType === "teacher" && (
              <>
                <label className="block mb-2 text-purple-600 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  value={credentials.email || ""}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </>
            )}

            {loginType === "admin" && (
              <>
                <label className="block mb-2 text-purple-600 font-semibold">
                  Admin ID
                </label>
                <input
                  type="text"
                  value={credentials.admin_id || ""}
                  onChange={(e) =>
                    handleInputChange("admin_id", e.target.value)
                  }
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </>
            )}

            <label className="block mb-2 text-purple-600 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={credentials.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Login
            </button>

            <p
              onClick={() => {
                setLoginType("");
                setCredentials({});
                setError("");
              }}
              className="mt-4 text-sm text-center text-gray-500 cursor-pointer hover:text-purple-700"
            >
              ← Back to Role Selection
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
