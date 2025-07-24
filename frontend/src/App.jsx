import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
