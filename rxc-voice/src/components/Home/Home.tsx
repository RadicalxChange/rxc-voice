import React, { useContext, useEffect } from "react";
// import { Link } from "react-router-dom";
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

    if (!processes.length) {
      fetchProcesses();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
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
  );
}

export default Home;
