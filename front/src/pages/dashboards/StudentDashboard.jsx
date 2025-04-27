import React from "react";
import LetterGlitch from "../../components/aurora";
import { Heading } from "@chakra-ui/react";
import '../../styles/style.css'
export default function StudentDashboard() {
  return (
    <div className="student-dashboard-container">
      {/* Heading placed above the glitch effect */}
      <Heading className="heading-text">There's Nothing To Show Here</Heading>

      {/* LetterGlitch component, placed as background */}
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
        className="glitch-background"
      />
    </div>
  );
}
