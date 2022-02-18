import React, { useContext, useEffect } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import collab_img from "../../assets/collab.png";
import group_img from "../../assets/group.png";
import convo_img from "../../assets/speech-bubbles.png";
import handshake_img from "../../assets/handshake.png";

import "./About.scss";

function About() {
  const { setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="about">
    <div id="about-info">
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
      <h2 className="privacy-title">Privacy Policy</h2>
      <h3>Definitions</h3>
      <ul className="bullets">
        <li><strong>RxC:</strong> RadicalxChange Foundation Ltd. We can be reached by mail at 137 Montague St. #298, Brooklyn NY 11201.</li>
        <li><strong>GDPR:</strong> General Data Protection Regulation Act.</li>
        <li><strong>Data Controller:</strong> Data Controller means the natural or legal person who determines the purposes whether or how any personal information are processed.</li>
        <li><strong>Data Processor:</strong> Data Processor means any natural or legal person who processes the data on behalf of the Data Controller.</li>
        <li><strong>Data Subject:</strong> Data Subject is any living individual who is using our service and is the subject of Personal Data.</li>
      </ul>
      <h3>Principles for processing personal data</h3>
      <ul className="bullets">
        <li><strong>Fairness and legality.</strong> When we process personal data, the individual rights of the Data Subjects must be protected. All personal data must be collected and processed in a legal and fair manner.</li>
        <li><strong>Restricted to a specific purpose.</strong> The personal data of Data Subject must be processed only for specific purposes.</li>
        <li><strong>Transparency.</strong> The Data Subject must be informed of how their data is being collected, processed and used.</li>
      </ul>
      <h3>What personal data we collect and process</h3>
      <p>RxC may collect several different types of personal data for various purposes. Personal Data may include, without restriction:</p>
      <ul className="bullets">
        <li>Email address</li>
        <li>First name and last name</li>
      </ul>
      <h3>How we use the personal data</h3>
      <p>RxC uses the collected personal data for various purposes:</p>
      <ul className="bullets">
        <li>To provide you with services</li>
        <li>To notify you about changes to our services and/or products</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our services</li>
        <li>To detect, prevent and address technical issues</li>
      </ul>
      <h3>Legal basis for collecting and processing personal data</h3>
      <p>RxC’s legal basis for collecting and using the personal data described in this Data Protection Policy depends on the personal data we collect and the specific context in which we collect the information:</p>
      <ul className="bullets">
        <li>You have given RxC explicit or implicit permission to do so</li>
        <li>RxC needs to comply with the law</li>
      </ul>
      <h3>Retention of personal data</h3>
      <p>RxC will retain your personal information only for as long as is necessary for the purposes explained in this Policy.</p>
      <p>RxC will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>
      <h3>Data protection rights</h3>
      <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what personal data we hold about you and if you want it to be removed from our systems, please contact us.</p>
      <p>In certain circumstances, you have the following data protection rights:</p>
      <ul className="bullets">
        <li>The right to access, update or to delete the information we have on you</li>
        <li>The right of rectification</li>
        <li>The right to object</li>
        <li>The right of restriction</li>
        <li>The right to data portability</li>
        <li>The right to withdraw consent</li>
      </ul>
      <h3>What personal data we collect and why</h3>
      <p><strong>Contact forms</strong></p>
      <p>If you would like to get involved as a volunteer, we ask for your information so we can work with you to find an appropriate way or you to contribute to our growing movement.</p>
      <p>If you would like to receive our newsletter, your information goes through MailChimp, which is the Data Processor for that activity.</p>
      <p><strong>Embedded content from other websites</strong></p>
      <p>Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p>
      <p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p>
      <p>RadicalxChange Foundation’s website is: [https://www.radicalxchange.org](https://www.radicalxchange.org)</p>
    </div>
  );
}

export default About;
