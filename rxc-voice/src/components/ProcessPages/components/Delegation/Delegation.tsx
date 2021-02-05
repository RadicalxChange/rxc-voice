import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { Process } from "../../../../models/Process";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import DelegateCard from "./components/DelegateCard";
import { Delegate } from "../../../../models/Delegate";
import { getId } from "../../../../utils";

import "./Delegation.scss";

function Delegation() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);
    if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
      selectProcess(processId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  const getDelegates = (process: Process | null) => {
    if (process) {
      return process.delegates;
    } else {
      return undefined;
    }
  };

  return (
    selectedProcess ? (
      <div className="delg-page">
        <div className="content-header">
          <h2>Delegation</h2>
        </div>
        <div className="delegation-content">
          {getDelegates(selectedProcess)!.length ? (
            <ul className="delegate-list">
              {getDelegates(selectedProcess)!.map((delegate: Delegate) => (
                <DelegateCard delegate={delegate} process={selectedProcess} key={delegate.id}></DelegateCard>
              ))}
            </ul>
          ) : (
            <h3>No delegates found.</h3>
          )}
        </div>
      </div>
    ) : (
      <h1>Process not found. Return to home.</h1>
    )
  );
}

export default Delegation;
