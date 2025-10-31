import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../NewPostPage.css";

export default function NewPostPage() {
  const { courseName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleFiles = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append("course_id", decodedCourse);
    formData.append("topic", title);

    attachments.forEach((file) => formData.append("attachments[]", file));

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      const data = await res.json();
      console.log("Created post:", data);

      navigate(`/course/${encodeURIComponent(decodedCourse)}`);
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <div className="course-page-container">
      <Navbar />
      <main className="course-page">
        <h2>Create a New Post in {decodedCourse}</h2>

        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFiles}
          />

          <button type="submit">Publish</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
