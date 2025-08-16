import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { Private } from "./components/PrivateRoute";
import DepartmentPage from "./pages/DepartmentPage";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import CoursePage from "./pages/CoursePage";
import NewPostPage from "./pages/NewPostPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<Private><HomePage /></Private>} />
      <Route path="/department/:deptName" element={<DepartmentPage />} />
      <Route path="/course/:courseName" element={<CoursePage />} />
      <Route path="/course/:courseName/new" element={<NewPostPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
