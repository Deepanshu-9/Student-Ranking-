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
import Hyperspeed from "../components/hyperSpeed";

const HomePage = () => {
  const [rankings, setRankings] = useState([]);
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

      // ✅ After successful fetch, auto-collapse the sidebar
      setIsSidebarCollapsed(true);
    } catch (err) {
      setError("Failed to fetch rankings.");
    }
  };

  const handleCardClick = (studentRollNumber, studentName) => {
    navigate(`/resultdetail/${studentRollNumber}`, {
      state: { batch, semester, rollNumber: studentRollNumber, studentName },
    });
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col scrollbar-hide bg-black min-h-screen">
      {/* Navbar */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Hyperspeed Background */}
      <Hyperspeed
        effectOptions={{
          onSpeedUp: () => {},
          onSlowDown: () => {},
          distortion: "turbulentDistortion",
          length: 400,
          roadWidth: 10,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
            sticks: 0x03b3c3,
          },
        }}
      />

      {/* Main Content */}
      <div className="flex scrollbar-hide flex-1 overflow-y-hidden pt-24">
        {/* Sidebar */}
        <div
          className={`fixed h-full scrollbar-hide top-0 z-10 p-4 shadow-lg scrollbar-hide flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-r-2xl transition-all duration-500 ${
            isSidebarCollapsed ? "w-16" : "w-full sm:w-1/3 lg:w-1/4"
          }`}
        >
          {/* Toggle Button */}
          <div className="flex justify-center mt-15">
            <Button
              size="sm"
              colorScheme=""
              variant="solid"
              onClick={handleSidebarToggle}
              borderRadius="full"
              w={isSidebarCollapsed ? "10" : "32"}
              h="10"
              fontSize="5xl"
              px={isSidebarCollapsed ? "0" : "4"}
            >
              {isSidebarCollapsed ? "+" : "-"}
            </Button>
          </div>

          {/* Sidebar Content */}
          {!isSidebarCollapsed && (
            <>
              {/* Heading */}
              <Heading
                color="gray.200"
                marginBottom="15px"
                className="text-3xl font-bold text-purple-200 mb-8 text-center pt-10"
              >
                Select Options
              </Heading>

              {/* Select Inputs */}
              <div className="flex flex-col gap-4">
                <Select
                  borderColor="purple.200"
                  _hover={{ borderColor: "purple.300" }}
                  _focus={{
                    borderColor: "purple.300",
                    boxShadow: "0 0 0 1px purple",
                  }}
                  color="gray.100"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option className="text-black" value="">
                    Select Batch
                  </option>
                  <option className="text-black" value="2022-2025">
                    2022-2025
                  </option>
                  <option className="text-black" value="2023-2026">
                    2023-2026
                  </option>
                  <option className="text-black" value="2024-2027">
                    2024-2027
                  </option>
                </Select>

                <Select
                  borderColor="purple.200"
                  color="gray.100"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option className="text-black" value="">
                    Select Semester
                  </option>
                  <option className="text-black" value="1">
                    Semester 1
                  </option>
                  <option className="text-black" value="2">
                    Semester 2
                  </option>
                  <option className="text-black" value="3">
                    Semester 3
                  </option>
                  <option className="text-black" value="4">
                    Semester 4
                  </option>
                  <option className="text-black" value="5">
                    Semester 5
                  </option>
                  <option className="text-black" value="6">
                    Semester 6
                  </option>
                </Select>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center mt-6">{error}</p>}
            </>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 overflow-y-auto ${
            isSidebarCollapsed ? "ml-20" : "ml-[25.33333%]"
          }`}
        >
          <Heading
            color={"white"}
            marginBottom={"8px"}
            className="text-4xl font-bold text-purple-200 text-center"
          >
            Student Ranks
          </Heading>

          {rankings.length === 0 && (
            <p className="text-gray-300 text-center">No ranks to display.</p>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 scrollbar-hide sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {rankings.map((student) => (
              <Card
                key={student.student_roll_number}
                width="100%"
                border="1px"
                borderColor="purple.200"
                rounded="xl"
                bg="#aeeeed"
                bgGradient="radial-gradient(circle,rgba(174, 238, 237, 0.06) 0%, rgba(148, 187, 233, 1) 100%)"
                opacity={0.8}
                backdropFilter="blur(10px)"
                boxShadow="lg"
                _hover={{ boxShadow: "2xl", transform: "scale(1.02)" }}
                transition="all 0.3s ease"
                cursor="pointer"
                onClick={() =>
                  handleCardClick(student.student_roll_number, student.student_name)
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
