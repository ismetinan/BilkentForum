import React, { useState } from 'react';
import logo from '../public/logo2.png';
import { Link } from 'react-router-dom';

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
      <span style={{ color: '#111e24' }}>Welcome to Bilkent Forum</span>
      <img src={logo} style={{ width: '500px', height: 'auto' }} alt="Description" />
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
            <a href="#" style={{ color: '#aaa' }}>Forgot my Password</a> &nbsp;•&nbsp;
            <Link to="/register" style={{ color: '#aaa' }}>Register</Link>
          </div>
    </div>
  );
};

export default LoginForm;
