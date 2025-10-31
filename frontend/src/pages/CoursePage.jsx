import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../CoursePage.css";

export default function CoursePage() {
  const { courseName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token being sent:", token);
      console.log(posts); // <- burada attachment yapısını kontrol et

      if (!token) throw new Error("No access token");

      const res = await fetch(`http://localhost:8080/api/posts/list?course_id=${decodedCourse}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    console.log("Response status:", res.status); // Hata ayıklama için
      if (!res.ok) {
        const text = await res.text(); // backend’den gelen HTML hata mesajını görebilmek için
        console.error("Backend error:", text);
        throw new Error("Failed to load posts");
      }

      const data = await res.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPosts();
}, [decodedCourse]);



  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="course-page-container">
      <Navbar />
      <main className="course-page">
        <h2>{decodedCourse} Forum</h2>

        <div className="posts">
  {(posts || []).length > 0 ? (
    posts.map((post) => {
      const createdAt = post.created_at ? new Date(post.created_at) : null;
      return (
        <div key={post.id} className="post">
          <div className="post-header">
            <strong>{post.author_id || "Unknown"}</strong>
            <span className="time">
              {createdAt ? createdAt.toLocaleString() : "No date"}
            </span>
          </div>

          <h3 className="post-topic">{post.topic || "No topic"}</h3>

          <div className="post-attachments">
            {(post.attachments || []).map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-link"
              >
                📎 {a.file_name || "Unknown file"}
              </a>
            ))}
          </div>

          <div className="post-actions">
            <button>👍 Upvote</button>
            <button>🚩 Flag</button>
          </div>
        </div>
      );
    })
  ) : (
    <p>No posts yet</p>
  )}
</div>


        <Link
          to={`/course/${encodeURIComponent(decodedCourse)}/new`}
          className="plus-button"
        >
          +
        </Link>
      </main>
      <Footer />
    </div>
  );

}
