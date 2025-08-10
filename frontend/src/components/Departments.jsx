import React from "react";
import "../Departments.css";

const faculties = [
  {
    name: "Faculty of Applied Sciences",
    departments: [
      "Information Systems and Technologies",
      "Tourism and Hotel Management",
    ],
  },
  {
    name: "Faculty of Art, Design, and Architecture",
    departments: [
      "Department of Architecture",
      "Department of Communication and Design",
      "Department of Fine Arts",
      "Department of Graphic Design",
      "Department of Interior Architecture and Environmental Design",
      "Department of Urban Design and Landscape Architecture",
      "Art, Design and Architecture Courses",
    ],
  },
  {
    name: "Faculty of Business Administration",
    departments: ["Department of Management"],
  },
  {
    name: "Faculty of Economics, Administrative, and Social Sciences",
    departments: [
      "Department of Economics",
      "Department of History",
      "Department of International Relations",
      "Department of Political Science and Public Administration",
      "Department of Psychology",
    ],
  },
  {
    name: "Faculty of Education",
    departments: [
      "Department of Basic Education",
      "Curriculum and Instruction",
      "Teaching English as a Foreign Language",
    ],
  },
  {
    name: "Faculty of Engineering",
    departments: [
      "Department of Computer Engineering",
      "Department of Electrical and Electronics Engineering",
      "Department of Industrial Engineering",
      "Department of Mechanical Engineering",
    ],
  },
  {
    name: "Faculty of Humanities and Letters",
    departments: [
      "Department of American Culture and Literature",
      "Department of Archaeology",
      "Department of Translation and Interpretation",
      "Department of English Language and Literature",
      "Department of Philosophy",
      "Department of Turkish Literature",
      "Program in Cultures, Civilizations, and Ideas",
      "Turkish Unit",
    ],
  },
  {
    name: "Faculty of Law",
    departments: ["Faculty of Law"], // No specific departments given
  },
  {
    name: "Faculty of Music and Performing Arts",
    departments: ["Department of Music", "Department of Performing Arts"],
  },
  {
    name: "Faculty of Science",
    departments: [
      "Department of Chemistry",
      "Department of Mathematics",
      "Department of Molecular Biology and Genetics",
      "Department of Physics",
    ],
  },
];

export default function Departments() {
  return (
    <div className="departments-container">
      {faculties.map((faculty, idx) => (
        <div key={idx} className="faculty-section">
          <h2 className="faculty-title">{faculty.name}</h2>
          <div className="department-grid">
            {faculty.departments.map((dept, index) => (
              <div
                key={index}
                className="department-card"
                onClick={() => alert(`Navigating to ${dept}`)}
              >
                {dept}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
