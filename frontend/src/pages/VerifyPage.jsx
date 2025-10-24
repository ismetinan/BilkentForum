import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // email & password passed from RegisterPage
  const email = location.state?.email || "";
  const password = location.state?.password || "";

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const verifyRes = await fetch("http://localhost:8080/api/verify/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!verifyRes.ok) throw new Error("Invalid or expired verification code.");

      setMessage("Email verified successfully! Registering account...");

      // Now actually register the user
      const registerRes = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!registerRes.ok) {
        const result = await registerRes.json();
        throw new Error(result.error || "Registration failed");
      }

      setMessage("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleVerifyCode}>
        <h2 style={{ textAlign: "center" }}>VERIFY EMAIL</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="text"
          placeholder="Enter verification code"
          className="register-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="register-button">
          Verify & Register
        </button>

        <div style={{ marginTop: "1rem" }}>
          <a href="/register" style={{ color: "#aaa" }}>
            Back to Register
          </a>
        </div>
      </form>
    </div>
  );
}
