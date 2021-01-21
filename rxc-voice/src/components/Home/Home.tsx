import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { Process } from "../../models/Process";
import ProcessCard from "./components/ProcessCard";

import "./Home.scss";

function Home() {
  const { setColor, fetchProcesses } = useContext(ActionContext);
  const { processes, activeProcesses, pastProcesses } = useContext(StateContext);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    setColor(BgColor.Yellow);

    if (!processes.length) {
      fetchProcesses();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <div className="about">
        <h1 className="title">RxC Voice</h1>
        <span>
          Welcome to RxC Voice, RadicalxChange's platform for collective
          decision making! The progress bars on the left represent where we are
          in our multi-stage democratic process - click on any stage to
          participate or see results.
        </span>
        {!showAbout ? (
          <button
            type="button"
            className="show-hide"
            onClick={() => setShowAbout(showAbout => true)}
          >
          About the process
          </button>
        ) : (
          <div className="about">
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
              generated in the Deliberation Stage. This stage captures a detailed
              image of individual preferences using Quadratic Voting and publishes
              them for all delegates to see.
            </span>
            <button
              type="button"
              className="show-hide"
              onClick={() => setShowAbout(showAbout => false)}
            >
            Show less
            </button>
          </div>
        )}
      </div>
      <div className="content">
        <h1>Active</h1>
          {activeProcesses.length ? (
            <ul className="process-list">
              {activeProcesses.map((process: Process) => (
                <ProcessCard process={process} key={process.id} />
              ))}
            </ul>
          ) : (
            <h3>None</h3>
          )}
        <h1>Past</h1>
          {pastProcesses.length ? (
            <ul className="process-list">
              {pastProcesses.map((process: Process) => (
                <ProcessCard process={process} key={process.id} />
              ))}
            </ul>
          ) : (
            <h3>None</h3>
          )}
      </div>
    </div>
  );
}

export default Home;
