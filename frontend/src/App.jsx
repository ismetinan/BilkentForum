import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { Private } from "./components/PrivateRoute";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<Private><HomePage /></Private>} />
    </Routes>
  );
}

export default App;
