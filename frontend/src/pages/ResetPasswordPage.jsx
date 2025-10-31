import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';

  const handleReset = async (e) => {
    e.preventDefault();

    if (!code || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Password reset failed");
      }

      setMessage("Password reset successful! Redirecting to login...");
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleReset}>
        <h2 style={{ textAlign: 'center' }}>RESET PASSWORD</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        
        <input
          type="text"
          placeholder="Enter reset code"
          className="register-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="New Password"
          className="register-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Confirm New Password"
          className="register-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <button type="submit" className="register-button">Reset Password</button>
      </form>
    </div>
  );
}
