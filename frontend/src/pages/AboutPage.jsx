import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../AboutPage.css";

function AboutPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="about-container">
        <h1 className="about-title">About Bilkent Forum</h1>

        <div className="faq-section">
          <h2>Purpose of the Forum</h2>
          <p>
            This forum is designed for students to share knowledge, ask
            questions, and collaborate on academic and social topics. Each
            department has its own dedicated space to organize discussions and
            resources.
          </p>
        </div>

        <div className="faq-section">
          <h2>How to Use</h2>
          <p>
            Navigate to your department, choose a course, and join the
            discussion. You can read existing posts, comment, or create a new
            post by clicking the plus button. File sharing is also supported
            within posts.
          </p>
        </div>

        <div className="faq-section">
          <h2>Community Guidelines</h2>
          <p>
            Be respectful and constructive. Share accurate information, avoid
            spam, and keep the discussions relevant to the courses or topics at
            hand. Our goal is to maintain a helpful and friendly environment for
            everyone.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
