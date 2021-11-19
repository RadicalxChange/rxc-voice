import React, { useContext, useEffect } from "react";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { Process } from "../../models/Process";
import ProcessCard from "./components/ProcessCard";

import "./Home.scss";

function Home() {
  const { setColor, fetchProcesses } = useContext(ActionContext);
  const { processes, activeProcesses, pastProcesses } = useContext(StateContext);

  useEffect(() => {
    setColor(BgColor.Yellow);

    if (processes === undefined) {
      fetchProcesses();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <h1 className="title">Welcome to RxC Voice</h1>
      <p>RadicalxChange's platform for collective decision making!<br></br>
      Click on a decision below to participate or see results.</p>
      <div className="create-button">
        <a href="/create-event">+ Create a new Event</a>
      </div>
      {activeProcesses?.length || pastProcesses?.length ? (
        <div className="content">
          {activeProcesses ? (
            <ul className="process-list">
              {activeProcesses.map((process: Process) => (
                <ProcessCard process={process} key={process.id} active={true} />
              ))}
            </ul>
          ) : null}
          {pastProcesses ? (
            <ul className="process-list">
              {pastProcesses
                .filter((process: Process) => (
                  process.title==="RadicalxChange Agenda 2021-2022"
                ))
                .map((process: Process) => (
                <ProcessCard key={process.id} process={process} active={false} />
              ))}
            </ul>
          ) : null}
        </div>
        ) : (
          <p className="no-events">When you participate in an event, it will appear here!</p>
        )}
    </div>
  );
}

export default Home;
