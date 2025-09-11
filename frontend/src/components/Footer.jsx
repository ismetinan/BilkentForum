import React from "react";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        Bilkent Forum is a platform to make the sources reachable for everyone.
      </p>
      <a
        href="https://www.linkedin.com/in/ismet-i-29a1682a5/"
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