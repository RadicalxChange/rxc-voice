import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";
import downArrow from "../../assets/icons/down_arrow.svg";
import collab_img from "../../assets/collab.png";
import group_img from "../../assets/group.png";
import convo_img from "../../assets/speech-bubbles.png";
import handshake_img from "../../assets/handshake.png";
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
          <Link
          to={`/login`}
          className="nav-link"
          >
          Sign in
          </Link>
        </div>
        <div className="top-panel_content">
          <img src={logo} className="App-logo" alt="logo" />
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
        <div className="scroll-arrow">
          <p>Scroll to learn more</p>
          <img src={downArrow} alt="down arrow" />
        </div>
      </div>
      <div id="info">
        <section className="panel">
          <div className="subpanel_image">
            <img src={collab_img} alt="collaboration" />
          </div>
          <div id="first-panel" className="subpanel_text">
            <h2>Introducing RxC Voice.</h2>
            <p>
              <strong>RxC Voice</strong> is a modular way for groups to evolve and make decisions democratically.
            </p>
            <ul className="bullets">
              <li>Form a group.</li>
              <li>Explore a shared problem.</li>
              <li>Identify actionable compromises.</li>
            </ul>
          </div>
        </section>
        <section className="panel">
          <div className="subpanel_image">
            <img src={group_img} alt="form a group" />
          </div>
          <div className="subpanel_text">
            <h2>Form a group.</h2>
            <p>
              Voice helps groups <strong>surface leadership</strong> by encouraging participants to signal who they trust.
            </p>
            <ul className="bullets">
              <li><strong>Everyone’s voice is equal</strong>: participants start with an equal number of voice credits.</li>
              <li>Optionally, participants may be permitted to delegate some of their voice credits to others, so <strong>trust and specialized knowledge is accounted for.</strong></li>
              <li>Widely trusted individuals can receive a voice credit bonus via <a
                href="http://wtfisqf.com"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >Quadratic Funding</a>.</li>
              <li><strong>The group grows organically</strong> when participants transfer voice credits to new contacts.</li>
              <li>Even after delegating, <strong>everyone can participate directly</strong>.</li>
            </ul>
          </div>
        </section>
        <section className="panel">
          <div className="subpanel_image">
            <img src={convo_img} alt="conversation" />
          </div>
          <div className="subpanel_text">
            <h2>Explore a shared problem.</h2>
            <p>
              Voice makes it easy to <strong>explore a shared problem</strong>, identifying and building on areas of consensus.
            </p>
            <ul className="bullets">
              <li><strong>Everyone’s voice is heard</strong> in a Pol.is conversation.</li>
              <li>Users can share thoughts, feelings, opinions, values, facts, or principles they feel are relevant.</li>
              <li>There are no replies or threads, so <strong>disagreements don’t derail the agenda</strong>.</li>
              <li>Users iterate on comments they don’t quite agree with, and thereby <strong>ideas evolve toward consensus</strong>.</li>
              <li>Pol.is outputs meaningful data about which comments built consensus and which were divisive.</li>
            </ul>
          </div>
        </section>
        <section className="panel">
          <div className="subpanel_image">
            <img src={handshake_img} alt="handshake" />
          </div>
          <div className="subpanel_text">
            <h2>Identify actionable compromises.</h2>
            <p>
              Voice helps groups <strong>define their options</strong> and <strong>find compromises</strong> that lead to collective action.
            </p>
            <ul className="bullets">
              <li><strong>Ballot construction is decentralized</strong>. A ballot of actionable options for the group is constructed from user submissions in the Pol.is conversation.</li>
              <li>An appointed curator ensures that the proposals are coherent. Users can reject the ballot if they disapprove of the curation.</li>
              <li>A shared decision is reached using <a
                href="https://quadraticvote.radicalxchange.org/"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >Quadratic Voting</a> (QV).</li>
              <li>With QV, users can express the magnitude of their preferences, which means <strong>apathetic majorities don’t swing decisions</strong>.</li>
              <li>By imposing an increasing cost on strong preferences, <strong>QV incentivizes coalition building and compromise</strong>.</li>
            </ul>
          </div>
        </section>
        <section id="last-panel">
          <div>
            <h2>Group decision making is a public good.</h2>
            <p>
              RxC Voice is an open-source <a
                href="https://github.com/RadicalxChange/rxc-voice"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >project</a> maintained by the <a
                href="https://radicalxchange.org/"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >RadicalxChange Foundation</a>, a 501(c)(3) nonprofit organization.
            </p>
            <p>
              <a
                href="https://pol.is/"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >Pol.is</a> is an open-source <a
                href="https://github.com/pol-is/"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >project</a> maintained by <a
                href="https://compdemocracy.org/"
                target="_blank"
                rel="noopener nofollow noreferrer"
                className="inline-link"
              >The Computational Democracy Project</a>, a 501(c)(3) nonprofit organization.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
