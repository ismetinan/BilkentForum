import React, { useState } from 'react';
import logo from '../public/logo.png'; // make sure you place the logo image here

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // Later you'll send this to your Go backend via fetch or axios
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Bilkent Logo" className="login-logo" />
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          placeholder="E-mail Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">LOGIN</button>
      </form>
      <div className="login-links">
        <a href="#" style={{ color: '#aaa' }}>Bilkent Forum</a> &nbsp;•&nbsp;
        <a href="#" style={{ color: '#aaa' }}>Register</a>
      </div>
    </div>
  );
};

export default LoginForm;
