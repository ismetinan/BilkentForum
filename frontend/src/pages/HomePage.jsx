// src/pages/HomePage.jsx
import React from "react";
import Departments from "../components/Departments";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
  
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Departments />
      <div>
        {/* Additional home page content */}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;