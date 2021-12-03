import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./LandingPage.scss";

function LandingPage() {
  const { setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <a
        href="https://www.radicalxchange.org/media/announcements/rxc-voice/"
        target="_blank"
        rel="noopener nofollow noreferrer"
        >
          <button type="button">
              Learn More
          </button>
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
