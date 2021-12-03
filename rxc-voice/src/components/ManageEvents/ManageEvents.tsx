import React, { useContext, useEffect } from "react";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { Process } from "../../models/Process";
import { User } from "../../models/User";
import { getUserData } from "../../utils";
import ProcessCard from "./components/ProcessCard";

import "./ManageEvents.scss";

function ManageEvents() {
  const { setColor, fetchProcesses } = useContext(ActionContext);
  const { processes, activeProcesses, pastProcesses } = useContext(StateContext);
  const user: User | undefined = getUserData();

  useEffect(() => {
    setColor(BgColor.Yellow);

    if (processes === undefined) {
      fetchProcesses();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <h1 className="title">Manage My Events</h1>
      <p>Manage the events that you created.</p>
      {(activeProcesses?.length || pastProcesses?.length) && user ? (
        <div className="content">
          {activeProcesses?.length && user.processes_managed.length ? (
            <ul className="process-list">
              {activeProcesses
                .filter((process: Process) => (
                  user.processes_managed.includes(process.id)
                ))
                .map((process: Process) => (
                <ProcessCard process={process} key={process.id} active={true} />
              ))}
            </ul>
          ) : null}
          {pastProcesses?.length && user.processes_managed.length ? (
            <ul className="process-list">
              {pastProcesses
                .filter((process: Process) => (
                  user.processes_managed.includes(process.id)
                ))
                .map((process: Process) => (
                <ProcessCard key={process.id} process={process} active={false} />
              ))}
            </ul>
          ) : null}
        </div>
        ) : (
          <p className="no-events">If you create your own events, you can manage them here.</p>
        )}
    </div>
  );
}

export default ManageEvents;
