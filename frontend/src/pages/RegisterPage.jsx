import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendVerification = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.endsWith("@ug.bilkent.edu.tr")) {
      setError("Only Bilkent emails are allowed.");
      return;
    }

    try {
      const response = await fetch('api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send verification email.");

      setMessage("Verification code sent to your email!");
      setError("");

      // go to verify page with email & password
      navigate("/verify", { state: { email, password } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleSendVerification}>
        <h2 style={{ textAlign: "center" }}>REGISTER</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="email"
          placeholder="Bilkent Email (@ug.bilkent.edu.tr)"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="register-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-button">
          Send Verification Code
        </button>

        <div style={{ marginTop: "1rem" }}>
          <a href="/login" style={{ color: "#aaa" }}>
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}
