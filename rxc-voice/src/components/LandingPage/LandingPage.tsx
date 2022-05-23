import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";
import rxc_logo from "../../assets/icons/logo-yellow.svg";
import form_group_img from "../../assets/form-group.png";
import explore_prob_img from "../../assets/explore-problem.png";
import identify_comp_img from "../../assets/identify-compromise.png";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./LandingPage.scss";

function LandingPage() {
  const { setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.White);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="landing-page">
      <div id="top-panel">
        <div className="lp-header">
          <div className="logo-container">
            <a
              href="https://radicalxchange.org"
              target="_blank"
              rel="noopener nofollow noreferrer"
              className="nav-link"
            >
              <button type="button" className="header-button">
                <img src={rxc_logo} className="App-logo" alt="logo" />
              </button>
            </a>
          </div>
          <div className="nav">
            <a
              href="https://radicalxchange.org"
              target="_blank"
              rel="noopener nofollow noreferrer"
              className="nav-link"
            >
              <button type="button" className="header-button">
                <span>RxC Home</span>
              </button>
            </a>
            <a
              href="https://github.com/RadicalxChange/rxc-voice"
              target="_blank"
              rel="noopener nofollow noreferrer"
              className="nav-link"
            >
              <button type="button" className="header-button">
                <span>Github</span>
              </button>
            </a>
            <Link
            to={`/login`}
            className="nav-link"
            >
              <button type="button" className="header-button">
                <span>Sign in</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="top-panel_row-2">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="top-panel_row-3">
          <p className="subtitle">A way for groups to evolve and make decisions democratically</p>
          <Link
          to={`/verify`}
          >
            <button type="button">
                Get Started
            </button>
          </Link>
          <a href="#info">
            <button type="button">
                Learn More
            </button>
          </a>
        </div>
      </div>
      <div id="info">
        <section id="first-panel" className="panel">
          <div>
            <h2>Introducing RxC Voice</h2>
            <p>A modular way for groups to evolve and make decisions democratically.</p>
          </div>
          <div id="stages">
            <img src={form_group_img} alt="handshake" />
            <p>Form a group</p>
            <img src={explore_prob_img} alt="handshake" />
            <p>Explore a shared problem</p>
            <img src={identify_comp_img} alt="handshake" />
            <p>Identify actionable compromises</p>
          </div>
        </section>
        <section className="panel stage-panel">
          <div className="subpanel_text">
            <h2>Form a group</h2>
            <p className="subpanel_subtitle">
              Voice helps groups surface leadership by encouraging participants to signal who they trust.
            </p>
            <p>Everyone’s voice is equal: participants start with an equal number of voice credits.</p>
            <p>Optionally, participants may be permitted to delegate some of their voice credits to others, so trust and specialized knowledge is accounted for.</p>
            <p>Widely trusted individuals can receive a voice credit bonus via Quadratic Funding.</p>
            <p>The group grows organically when participants transfer voice credits to new contacts.</p>
            <p>Even after delegating, everyone can participate directly.</p>
          </div>
          <div className="subpanel_image">
            <img src={form_group_img} alt="form a group" />
          </div>
        </section>
        <section className="panel stage-panel">
          <div className="subpanel_text">
            <h2>Explore a shared problem</h2>
            <p className="subpanel_subtitle">
              Voice makes it easy to explore a shared problem, identifying and building on areas of consensus.
            </p>
            <p>Everyone’s voice is heard in a Pol.is conversation.</p>
            <p>Users can share thoughts, feelings, opinions, values, facts, or principles they feel are relevant.</p>
            <p>There are no replies or threads, so disagreements don’t derail the agenda.</p>
            <p>Users iterate on comments they don’t quite agree with, and thereby ideas evolve toward consensus.</p>
            <p>Pol.is outputs meaningful data about which comments built consensus and which were divisive.</p>
          </div>
          <div className="subpanel_image">
            <img src={explore_prob_img} alt="conversation" />
          </div>
        </section>
        <section className="panel stage-panel">
          <div className="subpanel_text">
            <h2>Identify actionable compromises</h2>
            <p className="subpanel_subtitle">
              Voice helps groups define their options and find compromises that lead to collective action.
            </p>
            <p>Ballot construction is decentralized. A ballot of actionable options for the group is constructed from user submissions in the Pol.is conversation.</p>
            <p>An appointed curator ensures that the proposals are coherent. Users can reject the ballot if they disapprove of the curation.</p>
            <p>A shared decision is reached using Quadratic Voting (QV).</p>
            <p>With QV, users can express the magnitude of their preferences, which means apathetic majorities don’t swing decisions.</p>
            <p>By imposing an increasing cost on strong preferences, QV incentivizes coalition building and compromise.</p>
          </div>
          <div className="subpanel_image">
            <img src={identify_comp_img} alt="handshake" />
          </div>
        </section>
        <section id="last-panel">
          <div>
            <h2>Group decision making is a public good.</h2>
            <div id="last-panel_text">
              <p>
                <span style={{ color: "var(--yellowColor)" }}>RxC Voice</span> is an open-source <a
                  href="https://github.com/RadicalxChange/rxc-voice"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  className="inline-link white-link"
                  id="voice-link"
                >project</a> maintained by the <a
                  href="https://radicalxchange.org/"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  className="inline-link white-link"
                >RadicalxChange Foundation</a>, a 501(c)(3) nonprofit organization.
              </p>
              <p>
                <a
                  href="https://pol.is/"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  style={{ color: "#03a9f4" }}
                >Pol.is</a> is an open-source <a
                  href="https://github.com/pol-is/"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  className="inline-link white-link"
                >project</a> maintained by <a
                  href="https://compdemocracy.org/"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  className="inline-link white-link"
                >The Computational Democracy Project</a>, a 501(c)(3) nonprofit organization.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
