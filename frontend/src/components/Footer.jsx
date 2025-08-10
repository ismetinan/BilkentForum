import React from "react";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        Bilkent Forum is a platform to make the sources reachable for everyone.
      </p>
      <a
        href="https://linkedin.com/in/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        My LinkedIn
      </a>
    </footer>
  );
};

export default Footer;