import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import logo from "../assets/Logo.png";

const Landing = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    console.log("[Landing] Join Now clicked.");
    navigate("/login"); // App.js handles redirect if user is logged in
  };

  return (
    <div className="landing-container">
      <div className="content-left">
        <h1 className="landing-title">PARAREAD</h1>
        <p className="landing-subtitle">
          Read smarter,<br />
          understand better
        </p>
        <button className="join-button" type="button" onClick={handleJoinNow}>
          JOIN NOW
        </button>
      </div>

      <div className="logo-container">
        <div className="glow-circle"></div>
        <img src={logo} alt="ParaRead Logo" className="logo-image" />
      </div>

      <p className="bottom-text">
        A web-based learning tool to boost student understanding
      </p>
    </div>
  );
};

export default Landing;
