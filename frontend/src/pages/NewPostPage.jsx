import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../NewPostPage.css";

export default function NewPostPage() {
  const { courseName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    // Later: send to backend here
    console.log("New post:", newPost);

    navigate(`/course/${encodeURIComponent(decodedCourse)}`); // go back to forum
  };

  return (
    <div className="course-page-container">
      <Navbar />
      <main className="course-page">
        <h2>Create a New Post in {decodedCourse}</h2>

        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write your post..."
          ></textarea>
          <button type="submit">Publish</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
