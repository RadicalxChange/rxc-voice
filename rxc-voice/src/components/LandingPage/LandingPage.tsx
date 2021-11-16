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
        <Link
        to={`/verify`}
        >
          <button type="button">
              Get Started
          </button>
        </Link>
        <Link
        to={`/`}
        >
          <button type="button">
              Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
