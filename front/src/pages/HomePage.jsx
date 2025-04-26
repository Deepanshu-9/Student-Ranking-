import React, { useState, useEffect } from "react";
import profileimage from "../assets/profile.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  Text,
  Input,
  Select,
  CardFooter,
  Image,
  Avatar,
  Button,
} from "@chakra-ui/react";

const HomePage = () => {
  const [rankings, setRankings] = useState([]);
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (batch && semester) {
      fetchRankings();
    }
  }, [batch, semester]);

  const fetchRankings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rankings", {
        params: { batch, semester },
      });
      setRankings(res.data);
    } catch (err) {
      setError("Failed to fetch rankings.");
    }
  };

  const handleCardClick = (studentRollNumber, studentName) => {
    navigate(`/resultdetail/${studentRollNumber}`, {
      state: { batch, semester, rollNumber: studentRollNumber, studentName },
    });
  };

  return (
    <div className="flex flex-col bg-[#edf2f4] min-h-screen">
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Main content with padding-top */}
      <div className="flex flex-1 overflow-y-hidden pt-24">
        {/* Sidebar */}
        <div className="w-full sm:w-1/3 lg:w-1/4 bg-[#90e0ef] p-6 shadow-lg flex flex-col fixed h-full top-0 z-10">
          {" "}
          {/* Make it fixed */}
          <Heading
            color="gray"
            marginBottom={"15px"}
            className="text-3xl font-bold text-purple-200 mb-8 text-center pt-20"
          >
            Select Options
          </Heading>
          <div className="flex flex-col gap-4">
            <Select
              bg=""
              color="gray"
              borderColor="purple.500"
              _hover={{ borderColor: "purple.300" }}
              _focus={{
                borderColor: "purple.400",
                boxShadow: "0 0 0 1px purple",
              }}
              onChange={(e) => setBatch(e.target.value)}
              value={batch}
            >
              <option value="">Select Batch</option>
              <option value="2022-2025">2022-2025</option>
              <option value="2023-2026">2023-2026</option>
              <option value="2024-2027">2024-2027</option>
            </Select>

            <Select
              borderColor="purple.500"
              onChange={(e) => setSemester(e.target.value)}
              color={"gray"}
              value={semester}
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </Select>
          </div>
          {error && <p className="text-red-500 text-center mt-6">{error}</p>}
        </div>

        {/* Scrollable student rankings */}
        <div className="flex-1 overflow-y-auto ml-[25.33333%] ">
          {" "}
          {/* Adjust the left margin for space */}
          <Heading
            color={"cyan.200"}
            marginBottom={"8px"}
            className="text-4xl font-bold text-purple-200 text-center "
          >
            Student Rankings
          </Heading>
          {rankings.length === 0 && (
            <p className="text-gray-300 text-center">No rankings to display.</p>
          )}
          {/* Card Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rankings.map((student) => (
              <Card
                key={student.student_roll_number}
                width="100%" // Ensure cards take full width in each grid cell
                border="1px"
                borderColor="purple.200"
                rounded="xl"
                bg=" #aeeeed" // light base color
                bgGradient="radial-gradient(circle,rgba(174, 238, 237, 0.06) 0%, rgba(148, 187, 233, 1) 100%)" // optional nice gradient
                opacity={0.8} // little transparent
                backdropFilter="blur(10px)" // glass blur!
                boxShadow="lg"
                _hover={{ boxShadow: "2xl", transform: "scale(1.02)" }}
                transition="all 0.3s ease"
                cursor="pointer"
                onClick={() =>
                  handleCardClick(
                    student.student_roll_number,
                    student.student_name
                  )
                }
              >
                <CardHeader display="flex" justifyContent="center" mt={2}>
                  <Avatar
                    size="xl"
                    src={profileimage}
                    name={student.student_name}
                    boxShadow="md"
                  />
                </CardHeader>

                <CardBody textAlign="center">
                  <Heading size="md" color="purple.700" mb={1}>
                    Rank #{student.rank}
                  </Heading>
                  <Text fontWeight="bold" fontSize="lg" color="gray.800">
                    {student.student_name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Roll: {student.student_roll_number}
                  </Text>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.900"
                    mt={2}
                  >
                    Final Score: {student.final_score}
                  </Text>
                </CardBody>

                <CardFooter justifyContent="center" gap={2}></CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
