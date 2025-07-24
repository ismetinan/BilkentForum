import React from 'react';

export default function RegisterPage() {
  return (
    <div className="login-container">
      <form className="register-form">
        <h2 style={{ color: 'Black', fontFamily: 'Times New Roman,sans-serif' ,fontSize: '48px', textAlign: 'center'}}>REGISTER</h2>

        <input type="text" placeholder="Full Name" className="register-input" />
        <input type="email" placeholder="Bilkent Email (@ug.bilkent.edu.tr)" className="register-input" />
        <input type="password" placeholder="Password" className="register-input" />
        <input type="password" placeholder="Confirm Password" className="register-input" />
        <button type="submit" className="register-button">Register</button>
        <div style={{ marginTop: '1rem' }}>
          <a href="/" style={{ color: '#aaa' }}>Back to Login</a>
        </div>
      </form>
    </div>
  );
}
