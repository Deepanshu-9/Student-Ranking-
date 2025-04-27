import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  Text,
  Button,
  Input,
} from "@chakra-ui/react";

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
    <>
      <div class="background">
        <ToastContainer />
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <div className="flex items-center justify-center min-h-screen bg-zinc-900   anim_gradient">
          <div className="login-card p-8 rounded-xl shadow-lg w-full max-w-md ">
            {!loginType ? (
              <div className="px-4">
                <Heading className="text-center text-white py-2  ">
                  Login As
                </Heading>
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => setLoginType("student")}
                    className="bg-blue-200 text-xl font-bold py-2  rounded-md hover:bg-blue-300"
                    colorPalette="teal"
                    variant="solid"
                  >
                    Student
                  </Button>
                  <Button
                    onClick={() => setLoginType("teacher")}
                    className="bg-indigo-300 text-xl font-bold  py-2 rounded-md hover:bg-indigo-400"
                  >
                    Teacher
                  </Button>
                  <Button
                    onClick={() => setLoginType("admin")}
                    className="bg-green-100 text-xl font-bold  py-2 rounded-md hover:bg-green-200"
                  >
                    Admin
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <Heading className="text-5xl font-bold text-center text-purple-200 mb-6 capitalize">
                  {loginType} Login
                </Heading>

                {error && (
                  <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                {loginType === "student" && (
                  <>
                    <label className="block mb-2 text-xl text-purple-300 font-semibold">
                      Roll Number
                    </label>
                    <Input
                      color={"white"}
                      type="text"
                      value={credentials.roll_number || ""}
                      onChange={(e) =>
                        handleInputChange("roll_number", e.target.value)
                      }
                      className="w-full bg-white mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </>
                )}

                {loginType === "teacher" && (
                  <>
                    <label className="block mb-2 text-xl text-purple-300 font-semibold">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={credentials.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      color={"white"}
                      className="w-full bg-white mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </>
                )}

                {loginType === "admin" && (
                  <>
                    <label className="block mb-2 text-xl text-purple-300 font-semibold">
                      Admin ID
                    </label>
                    <Input
                      type="text"
                      value={credentials.admin_id || ""}
                      onChange={(e) =>
                        handleInputChange("admin_id", e.target.value)
                      }
                      color={"white"}
                      className="w-full bg-white mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </>
                )}

                <label className="block mb-2 text-xl text-purple-300 font-semibold">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  color={"white"}
                  className="w-full bg-white mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />

                <Button
                  type="submit"
                  background={"purple.500"}
                  w="full"
                  fontWeight="bold"
                  fontSize="2xl"
                  py={2}
                  rounded="md"
                  _hover={{ bg: "purple.500" }}
                  transition="0.2s"
                  marginTop={"10px"}
                >
                  Login
                </Button>

                <p
                  onClick={() => {
                    setLoginType("");
                    setCredentials({});
                    setError("");
                  }}
                  className="mt-4 text-m text-center text-gray-100 cursor-pointer hover:text-purple-400"
                >
                  ← Back to Role Selection
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
