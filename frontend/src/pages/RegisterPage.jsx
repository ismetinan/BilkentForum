import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState(''); // In your backend you don't handle name, but added here in case you expand later
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.endsWith('@ug.bilkent.edu.tr')) {
      setError("Only Bilkent emails allowed.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Registration failed");
      }

      navigate('/login'); // Redirect to login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 style={{ textAlign: 'center' }}>REGISTER</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          className="register-input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Bilkent Email (@ug.bilkent.edu.tr)"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="register-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="register-button">Register</button>
        <div style={{ marginTop: '1rem' }}>
          <a href="/login" style={{ color: '#aaa' }}>Back to Login</a>
        </div>
      </form>
    </div>
  );
}
