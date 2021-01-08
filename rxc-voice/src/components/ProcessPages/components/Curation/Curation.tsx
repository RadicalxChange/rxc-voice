import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { Process } from "../../../../models/Process";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import { getId } from "../../../../utils";

import "./Curation.scss";

function Curation() {
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

  const getCurationInfo = (process: Process | null) => {
    if (process) {
      return process.curation_info;
    } else {
      return undefined;
    }
  };

  return (
    selectedProcess ? (
      <div className="cur-page">
        <h2 className="content-header">Curation</h2>
        <p>{getCurationInfo(selectedProcess)}</p>

      </div>
    ) : (
      <h1>Process not found. Return to home.</h1>
    )
  );
}

export default Curation;
