import React from "react";
import { useParams, Link } from "react-router-dom";
import "../DepartmentPage.css";

// You can later fetch this data from your backend
const departmentCourses = {
  "Information Systems and Technologies": [
    { name: "Courses", path: "/courses" },
    { name: "Offerings", path: "/offerings" },
    { name: "Curriculum", path: "/curriculum" },
    { name: "Staff", path: "/staff" },
    { name: "Catalog", path: "/catalog" },
    { name: "Web Page", path: "/webpage" },
  ],
  "Tourism and Hotel Management": [
    { name: "Courses", path: "/courses" },
    { name: "Offerings", path: "/offerings" },
    { name: "Curriculum", path: "/curriculum" },
  ],
  // Add more departments here
};

export default function DepartmentPage() {
  const { deptName } = useParams();
  const decodedName = decodeURIComponent(deptName);
  const courses = departmentCourses[decodedName] || [];

  return (
    <div className="department-page">
      <h1>{decodedName}</h1>
      <div className="course-buttons">
        {courses.map((course, index) => (
          <Link
            key={index}
            to={`/department/${encodeURIComponent(decodedName)}${course.path}`}
            className="course-button"
          >
            {course.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
