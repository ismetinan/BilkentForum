import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../ProfilePage.css";

function ProfilePage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [major, setMajor] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = { name, grade, major, isVisible };
    console.log("Profile saved:", profileData);
    alert("Profile updated successfully!");
    // later: send to backend (POST /api/profile)
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label>
            Grade
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Select grade</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="graduate">Graduate</option>
            </select>
          </label>

          <label>
            Major
            <input
              type="text"
              placeholder="Enter your major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </label>

          <label className="visibility-toggle">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
            />
            Make my profile visible to others
          </label>

          <button type="submit" className="save-btn">
            Save Profile
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
