import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import ProcessMenu from "../ProcessMenu";
import { StageType } from "../../models/Stage";
import { Process } from "../../models/Process";
import DelegationPage from "./components/DelegationPage";
import DeliberationPage from "./components/DeliberationPage";
import ElectionPage from "./components/ElectionPage";
import { Delegate } from "../../models/Delegate";

import "./ProcessPage.scss";

function ProcessPage() {
  const { processId, stageId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess, delegate } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setColor(BgColor.White);
    if (selectedProcess?.id !== +processId) {
      selectProcess(processId);
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, stageId, selectedProcess]);

  const renderPage = (process: Process, stage: any, delegate: Delegate) => {
    switch (stage.type) {
      case StageType.Delegation:
        return <DelegationPage process={process} delegation={stage} userDelegate={delegate} />
      case StageType.Conversation:
        return <DeliberationPage process={process} conversation={stage} userDelegate={delegate} />
      case StageType.Election:
        return <ElectionPage process={process} election={stage} userDelegate={delegate} />
    }
  };

  return (
    <>
    {!loading ? (
      selectedProcess && delegate ? (
        <div className="process-page">
          <div className="nav">
            <ProcessMenu process={selectedProcess} />
          </div>
          <div className="body">
            {renderPage(selectedProcess, selectedProcess.stages[+stageId], delegate)}
          </div>
        </div>
      ) : (
        <h3>Sorry! Something went wrong. Return home to find what you are looking for.</h3>
      )
    ) : (
      <h3>Loading...</h3>
    )}
    </>
  );
}

export default ProcessPage;
