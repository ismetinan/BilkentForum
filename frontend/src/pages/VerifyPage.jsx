import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Register'dan email'i buraya taşıyabilirsin (ör: navigate('/verify', { state: { email } }))
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      const response = await fetch('api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Verification failed");
      }

      // Doğrulama başarılı → login sayfasına yönlendir
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleVerify}>
        <h2 style={{ textAlign: 'center' }}>EMAIL VERIFICATION</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input
          type="text"
          placeholder="Enter your verification code"
          className="register-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        
        <button type="submit" className="register-button">Verify</button>
        
        <div style={{ marginTop: '1rem' }}>
          <a href="/register" style={{ color: '#aaa' }}>Back to Register</a>
        </div>
      </form>
    </div>
  );
}
