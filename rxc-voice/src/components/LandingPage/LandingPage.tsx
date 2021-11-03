import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";

import "./LandingPage.scss";

function LandingPage() {

  return (
    <div className="landing-page">
      <div className="lp-header">
        <Link
        to={`/login`}
        className="nav-link"
        >
        Sign in
        </Link>
      </div>
      <div className="top-panel">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="subtitle">A way for groups to evolve and make decisions democratically</p>
        <button type="button">
            <Link
            to={`/verify`}
            >
            </Link>
            Get Started
        </button>
        <button type="button">
            <Link
            to={`/`}
            >
            </Link>
            Learn More
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
