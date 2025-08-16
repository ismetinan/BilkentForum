import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../DepartmentPage.css";


const departmentCourses = {
  "Information Systems and Technologies": [
    "CTIS 151", "CTIS 152", "CTIS 163", "CTIS 164", "CTIS 165", 
    "CTIS 166", "CTIS 186", "CTIS 221", "CTIS 222", "CTIS 255",
    "CTIS 256", "CTIS 259", "CTIS 261", "CTIS 262", "CTIS 264",
    "CTIS 285", "CTIS 286", "CTIS 290", "CTIS 310", "CTIS 359",
    "CTIS 363", "CTIS 365", "CTIS 386", "CTIS 411", "CTIS 417",
    "CTIS 456", "CTIS 465", "CTIS 466", "CTIS 468", "CTIS 469",
    "CTIS 470", "CTIS 471", "CTIS 472", "CTIS 473", "CTIS 474",
    "CTIS 475", "CTIS 476", "CTIS 477", "CTIS 478", "CTIS 479",
    "CTIS 480", "CTIS 483", "CTIS 484", "CTIS 485", "CTIS 486",
    "CTIS 487", "CTIS 488", "CTIS 489", "CTIS 491", "CTIS 492",
    "CTIS 493", "CTIS 496", "CTIS 497", "CTIS 498", "CTIS 499"
  ],
  
};
export default function DepartmentPage() {
  const { deptName } = useParams();
  const decodedName = decodeURIComponent(deptName || "");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Loading department:", decodedName);
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const deptCourses = departmentCourses[decodedName];
        if (!deptCourses) {
          throw new Error(`Department "${decodedName}" not found`);
        }
        setCourses(deptCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [decodedName]);

  if (loading) return <div>Loading department...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div>
        <h1>{decodedName} Courses</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {courses.map((course, index) => (
            <Link 
              key={index}
              to={`/course/${encodeURIComponent(course)}`}
              style={{ padding: '1rem', border: '1px solid #3ac0e9ff' }}
            >
              {course}
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}