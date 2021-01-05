import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { Process } from "../../models/Process";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import { Status } from "../../models/Status";
import Curation from "./components/Curation";
import Delegation from "./components/Delegation";
import Deliberation from "./components/Deliberation";
import Election from "./components/Election";
import Initialization from "./components/Initialization";

import "./ProcessPages.scss";

function ProcessPages() {
  const { processId, stage } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess } = useContext(ActionContext);

  useEffect(() => {
    if (processId && !selectedProcess) {
      selectProcess(processId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  // const getStatus = (process: Process | null) => {
  //   if (process) {
  //     return process.status;
  //   } else {
  //     return undefined;
  //   }
  // }


  switch (stage) {
    case Status.Initialization: {
      return (
        <Initialization></Initialization>
      );
    }
    case Status.Delegation: {
      return (
        <Delegation></Delegation>
      );
    }
    case Status.Deliberation: {
      return (
        <Deliberation></Deliberation>
      );
    }
    case Status.Curation: {
      return (
        <Curation></Curation>
      );
    }
    case Status.Election: {
      return (
        <Election></Election>
      );
    }
    case undefined: {
      return (
        <h2>Process not found. Return to home.</h2>
      );
    }
  }
}

export default ProcessPages;
