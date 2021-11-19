import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import ProcessMenu from "../ProcessMenu";
import { Stage, StageType } from "../../models/Stage";
import { Process } from "../../models/Process";
import DelegationPage from "./components/DelegationPage";
import DeliberationPage from "./components/DeliberationPage";
import ElectionPage from "./components/ElectionPage";

import "./ProcessPage.scss";

function ProcessPage() {
  const { processId, stageId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess, loading } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);
  const [stage, setStage] = useState<Stage | undefined>(undefined);

  useEffect(() => {
    setColor(BgColor.White);
    if (selectedProcess?.id !== +processId) {
      selectProcess(processId);
    }
    setStage(selectedProcess?.stages[+stageId])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, stageId, selectedProcess]);

  const renderPage = (process: Process | undefined, stage: any) => {
    if (process && stage) {
      console.log(stage)
      switch (stage.type) {
        case StageType.Delegation:
          return <DelegationPage process={process} delegation={stage} />
        case StageType.Conversation:
          return <DeliberationPage process={process} conversation={stage} />
        case StageType.Election:
          return <ElectionPage process={process} election={stage} />
      }
    } else {
      return <h2>Loading...</h2>
    }
  };

  if (loading) {
    return (
      <div className="process-page">
        <h2>Loading...</h2>
      </div>
    );
  } else {
    return (
      <>
      {selectedProcess && stage ? (
        <div className="process-page">
          <div className="nav">
            <ProcessMenu process={selectedProcess} />
          </div>
          <div className="body">
            {renderPage(selectedProcess, stage)}
          </div>
        </div>
      ) : (
        <h3>Sorry, something went wrong. Head back to home to find what you're looking for.</h3>
      )}
      </>
    );
  }
}

export default ProcessPage;
