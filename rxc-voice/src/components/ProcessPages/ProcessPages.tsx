import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import { Status } from "../../models/Status";
import { getDescription, getEndDate, getTitle } from "../../utils";
import StatusBar from "../StatusBar";
import Delegation from "./components/Delegation";
import Deliberation from "./components/Deliberation";
import Election from "./components/Election";

import "./ProcessPages.scss";

function ProcessPages() {
  const { processId, stage } = useParams<ProcessPageRouteParams>();
  const { selectedProcess, loading } = useContext(StateContext);
  const { selectProcess } = useContext(ActionContext);

  useEffect(() => {
    if (processId && !selectedProcess) {
      selectProcess(processId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  const renderContent = () => {
    switch (stage) {
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
      case Status.Election: {
        return (
          <Election></Election>
        );
      }
      default: {
        return (
          <h2>Process not found. Return to home.</h2>
        );
      }
    }
  }

  if (loading) {
    return (
      <h2>Loading...</h2>
    );
  } else {
    return (
      <>
        <div className="process-subheader">
          <h1 className="title">{getTitle(selectedProcess)}</h1>
          {selectedProcess ? (
            <StatusBar process={selectedProcess} stage={stage}/>
          ) : (
            <></>
          )}
          <div className="time-remaining">
            <p>
              Closes {moment(getEndDate(selectedProcess), "YYYYMMDD").fromNow()}
            </p>
          </div>
          <p>{getDescription(selectedProcess)}</p>
        </div>
        {renderContent()}
      </>
    );
  }
}

export default ProcessPages;
