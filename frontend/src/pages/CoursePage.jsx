import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../CoursePage.css";

export default function CoursePage() {
  const { courseName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);

const [posts, setPosts] = useState([
  {
    id: 1,
    author: "Alice",
    topic: "Welcome to " + decodedCourse,
    attachment: null, // could be a file URL
    flags: 0,
    upvotes: 3,
    timestamp: new Date().toLocaleString(),
  },
  {
    id: 2,
    author: "Bob",
    topic: "Does anyone have past exams?",
    attachment: "https://example.com/exam.pdf",
    flags: 1,
    upvotes: 5,
    timestamp: new Date().toLocaleString(),
  },
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
              <div key={post.id} className="post">
                <div className="post-header">
                  <strong>{post.author}</strong>
                  <span className="time">{post.timestamp}</span>
                </div>

                <h3 className="post-topic">{post.topic}</h3>

                {post.attachment && (
                  <a
                    href={post.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    📎 Attachment
                  </a>
                )}

                <div className="post-actions">
                  <button
                    onClick={() =>
                      setPosts(posts.map((p) => (p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p)))
                    }
                  >
                    👍 {post.upvotes}
                  </button>

                  <button
                    onClick={() =>
                      setPosts(posts.map((p) => (p.id === post.id ? { ...p, flags: p.flags + 1 } : p)))
                    }
                  >
                    🚩 {post.flags}
                  </button>
                </div>
              </div>

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
