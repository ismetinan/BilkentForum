import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch('api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Request failed");
      }

      setMessage("A reset code has been sent to your email.");
      setError('');

      // Kullanıcıyı reset sayfasına yönlendir
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleForgot}>
        <h2 style={{ textAlign: 'center' }}>FORGOT PASSWORD</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        
        <input
          type="email"
          placeholder="Enter your registered email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <button type="submit" className="register-button">Send Reset Code</button>
        <div style={{ marginTop: '1rem' }}>
          <a href="/login" style={{ color: '#aaa' }}>Back to Login</a>
        </div>
      </form>
    </div>
  );
}
