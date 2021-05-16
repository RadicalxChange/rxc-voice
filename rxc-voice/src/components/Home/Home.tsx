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
      <h1 className="title">Welcome to RxC Voice</h1>
      <p>RadicalxChange's platform for collective decision making!<br></br>
      Click on a decision below to participate or see results.</p>
      <div className="content">
          {activeProcesses.length ? (
            <ul className="process-list">
              {activeProcesses.map((process: Process) => (
                <ProcessCard process={process} key={process.id} active={true} />
              ))}
            </ul>
          ) : (
            <></>
          )}
      </div>
    </div>
  );
}

export default Home;
