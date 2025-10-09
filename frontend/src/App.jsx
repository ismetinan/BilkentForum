import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute"; // ✅ fixed
import DepartmentPage from "./pages/DepartmentPage";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import CoursePage from "./pages/CoursePage";
import NewPostPage from "./pages/NewPostPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyPage from "./pages/VerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/department/:deptName" element={<DepartmentPage />} />
      <Route path="/course/:courseName" element={<CoursePage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/passwordreset" element={<ResetPasswordPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/course/:courseName/new"
        element={
          <PrivateRoute>
            <NewPostPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
