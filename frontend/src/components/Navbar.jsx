import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Navbar.css";
import logo from "../../public/logo2.png";

function Navbar({ onHeightChange }) {
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const navHeight = navRef.current.getBoundingClientRect().height;
      onHeightChange(navHeight);
    }
  }, [onHeightChange]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
