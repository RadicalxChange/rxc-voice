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
      <h3>Delegation</h3>
      <span>
        The process begins with the Delegation Stage. In this stage,
        you can invite others to participate by sending them
        voice credits. You can also send voice credits to other existing
        delegates. At the end of the Delegation Stage, we match all your
        transfers using Quadratic Funding! This gives you the power to
        democratically determine who gets a voice in the decision making
        process, and how strong each delegate's voice will be.
      </span>
      <h3>Deliberation</h3>
      <span>
        In the Deliberation Stage, you have the power to submit proposals
        for the final ballot! This stage is a conversation, where delegates
        can communicate the insights, opinions, or values/principles that
        they feel are relevant to the decision on the table. You can also
        "agree" or "disagree" with other delegates' posts. At the end of
        this stage, the administrators will curate the posts that generated
        the highest degree of consensus into a user-generated ballot for
        the final vote.
      </span>
      <h3>Election</h3>
      <span>
        The Election stage is where delegates will vote on the proposals
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
        captures a detailed image of individual preferences using Quadratic
        Voting and publishes them for all delegates to see.
      </span>
    </div>
  );
}

export default About;
