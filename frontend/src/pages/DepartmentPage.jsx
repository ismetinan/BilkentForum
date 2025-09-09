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
  "Department of Computer Engineering": [
    "CS 101", "CS 102", "CS 115", "CS 121", "CS 123",
    "CS 125", "CS 153", "CS 154", "CS 155", "CS 156",
    "CS 201", "CS 202", "CS 211", "CS 223", "CS 224",
    "CS 281", "CS 299", "CS 311", "CS 315", "CS 319",
    "CS 342", "CS 353", "CS 390", "CS 399", "CS 411",
    "CS 413", "CS 415", "CS 421", "CS 423", "CS 425",
    "CS 426", "CS 429", "CS 431", "CS 432", "CS 433",
    "CS 437", "CS 439", "CS 442", "CS 443", "CS 449",
    "CS 453", "CS 458", "CS 461", "CS 464", "CS 465",
    "CS 470", "CS 471", "CS 472", "CS 473", "CS 474",
    "CS 475", "CS 476", "CS 477", "CS 478", "CS 479",
    "CS 481", "CS 483", "CS 484", "CS 485", "CS 489",
    "CS 490", "CS 491", "CS 492", "CS 493", "CS 494",
    "CS 498", "CS 499", "CS 502", "CS 504", "CS 513",
    "CS 515", "CS 519", "CS 520", "CS 525", "CS 527",
    "CS 528", "CS 529", "CS 533", "CS 537", "CS 539",
    "CS 541", "CS 545", "CS 549", "CS 550", "CS 551",
    "CS 553", "CS 554", "CS 555", "CS 557", "CS 558",
    "CS 559", "CS 564", "CS 565", "CS 568", "CS 573",
    "CS 575", "CS 577", "CS 578", "CS 579", "CS 583",
    "CS 585", "CS 588", "CS 590", "CS 599", "CS 612",
    "CS 681", "CS 683", "CS 690", "CS 699"
  ]
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
      <div className="department-container">
        <h1>{decodedName} Courses</h1>
        <div className="courses-grid">
          {courses.map((course, index) => (
            <Link 
              key={index}
              to={`/course/${encodeURIComponent(course)}`}
              className="course-card"
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