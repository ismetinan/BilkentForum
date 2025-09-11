import React, { useState } from 'react';
import logo from '../../public/logo2.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Login.css'; // Assuming you have a CSS file for styling

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();

      // ✅ Save both tokens
      // ✅ Save token via context
      login(data.token);
      localStorage.setItem("refreshToken", data.refresh_token); // refresh token if you want to persist it
      localStorage.setItem("accessToken", data.token);

      // ✅ Redirect to homepage
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }
  };  


  return (
    <div className="login-container">
      <img src={logo} style={{ width: '500px', height: 'auto' }} alt="Description" />
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          placeholder="E-mail Address (@ug.bilkent.edu.tr)"
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
          <div className="login-links">&nbsp;•&nbsp;
            <a href="#" style={{ color: '#aaa' }}>Forgot my Password</a>&nbsp;•&nbsp;
            <Link to="/register" style={{ color: '#aaa' }}>Register</Link>
          </div>
    </div>
  );
};

export default LoginForm;
