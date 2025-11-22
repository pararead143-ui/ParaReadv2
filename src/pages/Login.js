import React, { useState, useEffect } from "react";
import axios from "../api/anxios";
import { useNavigate } from "react-router-dom";
import { refreshTokenIfExpired } from "../util/token";  
import "../styles/Login.css";
import logo from "../assets/Logo.png";

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // AUTO LOGIN IF TOKEN VALID
  useEffect(() => {
    const checkToken = async () => {
      const access = localStorage.getItem("access");
      if (!access) return;

      try {
        await refreshTokenIfExpired();
        const updatedAccess = localStorage.getItem("access");

        if (updatedAccess) {
          setLoggedIn?.(true);
          navigate("/home", { replace: true });
        }
      } catch (err) {
        console.log("[Login] Token check failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    };

    checkToken();
  }, [navigate, setLoggedIn]);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("auth/login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setLoggedIn?.(true);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      showToastMessage("❌ Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE HERO */}
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

      {/* RIGHT SIDE — LOGIN FORM */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-header">Welcome back</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Email or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <button className="login-btn" type="submit">
          Login
        </button>

        {showToast && (
          <div className="toast-message">
            {toastMessage}
          </div>
        )}

        <p className="login-links forgot" onClick={() => navigate("/forgot")}>
          Forgot Password?
        </p>

        <p className="login-links">
          Don’t have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
