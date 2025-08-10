
import React from "react";
import Navbar from "../components/Navbar";
import Departments from "../components/Departments";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Departments />
      <div style={{ padding: "20px", color: "#333" }}>

      </div>
      <Footer />
    </>
  );
};

export default HomePage;

