import React, { useState } from "react";
import axios from "../api/anxios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // using same styles as login
import logo from "../assets/Logo.png";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState(false); // highlight form
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError(false); // reset form error

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      await axios.post("auth/register/", { username, email, password });
      setMessage("✅ Account created successfully! Redirecting to login...");
      setShowToast(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);

      let errorMessage = "❌ Signup failed! Try again.";

      if (err.response?.data) {
        // username taken
        if (err.response.data.username) {
          errorMessage = `❌ Username "${username}" is already taken!`;
          setFormError(true);
        }
        // email taken
        else if (err.response.data.email) {
          errorMessage = `❌ Email "${email}" is already used!`;
          setFormError(true);
        }
        // password validation errors
        else if (err.response.data.password) {
          errorMessage =
            "❌ Password issue:\n" + err.response.data.password.join("\n");
          setFormError(true);
        }
      }

      setMessage(errorMessage);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT HERO */}
      <div className="left-side">
        <h1 className="app-title">PARAREAD</h1>

        <h2 className="app-tagline">
          READ SMARTER,<br />UNDERSTAND BETTER
        </h2>

        <div className="logo-wrapper">
          <img className="login-logo" src={logo} alt="ParaRead Logo" />
        </div>

        <p className="app-slogan">
          A WEB-BASED LEARNING TOOL TO BOOST STUDENT UNDERSTANDING
        </p>
      </div>

      {/* RIGHT SIDE — SIGNUP FORM */}
      <form
        className={`login-card ${formError ? "form-error" : ""}`}
        onSubmit={handleSignup}
      >
        <h2 className="login-header">Create Your Account</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className="login-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button className="login-btn" type="submit">
          Sign Up
        </button>

        {/* Toast message */}
        {showToast && <div className="toast-message">{message}</div>}

        <p className="login-links">
          Already have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/login")}>
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
