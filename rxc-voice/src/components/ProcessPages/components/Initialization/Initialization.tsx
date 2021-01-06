import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { Process } from "../../../../models/Process";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import { getId } from "../../../../utils";

import "./Initialization.scss";

function Initialization() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);
    if (processId && (!selectedProcess || getId(selectedProcess) !== processId)) {
      selectProcess(processId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  const getDescription = (process: Process | null) => {
    if (process) {
      return process.description;
    } else {
      return undefined;
    }
  };

  return (
    selectedProcess ? (
      <div className="init-page">
        <h2 className="content-header">Initialization</h2>
        <p>{getDescription(selectedProcess)}</p>

      </div>
    ) : (
      <h1>Process not found. Return to home.</h1>
    )
  );
}

export default Initialization;
