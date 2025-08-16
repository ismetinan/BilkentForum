import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../CoursePage.css";

export default function CoursePage() {
  const { courseName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);

  const [posts] = useState([
    { id: 1, author: "Alice", content: "Welcome to " + decodedCourse, timestamp: new Date().toLocaleString() },
    { id: 2, author: "Bob", content: "Does anyone have past exams?", timestamp: new Date().toLocaleString() },
  ]);

  return (
    <div className="course-page-container">
      <Navbar />
      <main className="course-page">
        <h2>{decodedCourse} Forum</h2>

        {/* Post Feed */}
        <div className="posts">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <p>
                <strong>{post.author}</strong>{" "}
                <span className="time">{post.timestamp}</span>
              </p>
              <p>{post.content}</p>
            </div>
          ))}
        </div>

        {/* Floating Plus Button */}
        <Link to={`/course/${encodeURIComponent(decodedCourse)}/new`} className="plus-button">
          +
        </Link>
      </main>
      <Footer />
    </div>
  );
}
