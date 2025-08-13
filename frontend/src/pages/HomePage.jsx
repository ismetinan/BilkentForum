import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Departments from "../components/Departments";
import Footer from "../components/Footer";

const HomePage = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  return (
    <>
      <Navbar onHeightChange={setNavbarHeight} />
      <main style={{ paddingTop: navbarHeight }}>
        <Departments />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
