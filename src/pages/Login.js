import React, { useState, useEffect } from "react";
import axios from "../api/anxios";
import { useNavigate } from "react-router-dom";
import { refreshTokenIfExpired } from "../util/token";
import "../styles/Login.css";
import logo from "../assets/Logo.png";

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Check if user already has a valid token
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const access = localStorage.getItem("access");
      if (!access) return;

      try {
        await refreshTokenIfExpired();

        const updatedAccess = localStorage.getItem("access");
        if (updatedAccess) {
          setLoggedIn?.(true); // update App's login state
          navigate("/home", { replace: true });
        }
      } catch (err) {
        console.log("[Login] Token refresh failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    };

    checkTokenAndRedirect();
  }, [navigate, setLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("auth/login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setLoggedIn?.(true); // update App's login state
      navigate("/home", { replace: true });
    } catch (err) {
      alert("Login failed! Check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="left-side">
        <h1 className="title">PARAREAD</h1>
        <h2 className="subtitle">
          READ SMARTER,<br />
          UNDERSTAND BETTER
        </h2>

        <div className="logo-container">
          <div className="logo-glow">
            <img src={logo} alt="ParaRead Logo" />
          </div>
        </div>

        <p className="slogan">
          A WEB-BASED LEARNING TOOL TO BOOST STUDENT UNDERSTANDING
        </p>
      </div>

      {/* RIGHT SIDE LOGIN CARD */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2>JOIN NOW!</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Email, username, or phone number"
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

        <p className="login-links" onClick={() => navigate("/forgot")}>
          Forgot Password?
        </p>

        <p className="login-links">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
