import React, { useContext, useEffect } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./About.scss";

function About() {
  const { setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="about">
      <div className="header">
        <h1 className="title">About RxC Voice</h1>
        <p>RadicalxChange's platform for collective decision making!</p>
      </div>
      <h2>Delegation</h2>
      <span className="explain-text">
        The process begins with the Delegation Stage. In this stage,
        you can invite others to participate by sending them
        voice credits. You can also send voice credits to other existing
        delegates. At the end of the Delegation Stage, we match all your
        transfers using{" "}
        <a
          href="https://www.radicalxchange.org/concepts/quadratic-funding/"
          target="_blank"
          rel="noopener nofollow noreferrer"
          className="inline-link"
        >Quadratic Funding</a>! This gives you the power to
        democratically determine who gets a voice in the decision making
        process, and how strong each delegate's voice will be.
      </span>
      <h3>Matching fund size</h3>
      <span className="explain-text">
        The size of the matching pool is determined by the number of voice
        credits in circulation. We multiply the number of initial delegates by
        the number of voice credits distributed to each delegate, then round
        the result to the nearest hundred.
      </span>
      <h2>Deliberation</h2>
      <span className="explain-text">
        In the Deliberation Stage, you have the power to submit proposals
        for the final ballot! This stage is a conversation, where delegates
        can communicate the insights, opinions, or values/principles that
        they feel are relevant to the decision on the table. You can also
        "agree" or "disagree" with other delegates' posts. At the end of
        this stage, the administrators will curate the posts that generated
        the highest degree of consensus into a user-generated ballot for
        the final vote.
      </span>
      <h2>Election</h2>
      <span className="explain-text">
        The Election stage is where delegates will use{" "}
        <a
          href="https://www.radicalxchange.org/concepts/quadratic-voting/"
          target="_blank"
          rel="noopener nofollow noreferrer"
          className="inline-link"
        >Quadratic Voting</a> to vote on the proposals
        generated in the Deliberation Stage. An essential option on the ballot
        will be "Ballot Ratification." With this particular ballot item, you
        can express whether or not you feel that the ballot fairly and
        accurately represents the delegates’ contributions in the Deliberation
        Stage. At the end of the Election, if the sum of effective votes for
        the Ballot Ratification option is less than zero, the results of the
        Election are nullified and a new ballot must be curated and voted on--
        so make sure you place a couple of voice credits toward supporting or
        opposing the Ballot Ratification option, depending on your satisfaction
        with the ballot curation. If the ballot gets approved, this stage
        captures a detailed image of individual preferences and publishes them
        for all delegates to see.
      </span>
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
