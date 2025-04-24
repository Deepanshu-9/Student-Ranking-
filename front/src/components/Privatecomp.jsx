import React from "react";
import { Navigate } from "react-router-dom";

const Privatecomp = ({ children }) => {
  const user = localStorage.getItem("user");

  return user ? children : <Navigate to="/" />;
};

export default Privatecomp;
