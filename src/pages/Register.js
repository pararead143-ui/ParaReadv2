import React, { useState } from "react";
import axios from "../api/anxios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logo from "../assets/Logo.png";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      await axios.post("auth/register/", { username, email, password });
      setMessage("✅ Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ Signup failed! Try again.");
      console.error(err);
    }
  };

  return (
    <div className="register-page">
      <div className="left-side-register">
        <h1 className="title-register">ParaRead</h1>
        <h2 className="subtitle-register">YOU'RE ONE MORE STEP AWAY FROM JOINING US</h2>
        <div className="logo-container-register">
          <div className="logo-glow-register">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <p className="slogan-register">INTERACTIVE READING SUPPORT</p>
      </div>

      <form className="register-card" onSubmit={handleSignup}>
        <h2>Create Your Account Now!</h2>
        <input
          type="text"
          placeholder="Username"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
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
        <button type="submit" className="register-btn">
          Sign Up
        </button>

        {message && (
          <p
            className="register-links"
            style={{ color: message.includes("successfully") ? "green" : "red" }}
          >
            {message}
          </p>
        )}

        <p className="register-links">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
