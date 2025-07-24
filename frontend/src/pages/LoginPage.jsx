import React, { useState } from 'react';
import logo from '../../public/logo2.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const login = (token) => {
    setToken(token);
    localStorage.setItem('accessToken', token); // Save access token to localStorage
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token); // Save to context
      navigate("/home");        // Go to homepage
    } else {
      console.error("Login failed");
    }
  };


  return (
    <div className="login-container">
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
