import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { ActionContext, StateContext } from "../../../../hooks";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import slugify from "react-slugify";

import "./ProcessSubheader.scss";
import { getEndDate, getId, getStatusBar, getTitle } from "../../../../utils";
import { Status } from "../../../../models/Status";

function ProcessSubheader() {
  const { processId, stage } = useParams<ProcessPageRouteParams>();
  const { selectedProcess, color } = useContext(StateContext);
  const { selectProcess } = useContext(ActionContext);

  useEffect(() => {
    if (processId && !selectedProcess) {
      selectProcess(processId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  return (
    <div className="process-subheader">
      <h1 className="title">{getTitle(selectedProcess)}</h1>
      <div className="stages">
        <Link
        to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Introduction`}
        className={`stage ${stage === Status.Introduction ? "selected-stage" : ""}`}
        >
        Introduction
        </Link>
        <Link
        to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Delegation`}
        className={`stage ${stage === Status.Delegation ? "selected-stage" : ""}`}
        >
        Delegation
        </Link>
        <Link
        to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Deliberation`}
        className={`stage ${stage === Status.Deliberation ? "selected-stage" : ""}`}
        >
        Deliberation
        </Link>
        <Link
        to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Curation`}
        className={`stage ${stage === Status.Curation ? "selected-stage" : ""}`}
        >
        Curation
        </Link>
        <Link
        to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Election`}
        className={`stage ${stage === Status.Election ? "selected-stage" : ""}`}
        >
        Election
        </Link>
      </div>
      <img
        src={getStatusBar(selectedProcess, color)}
        className="status-bar"
        alt="logo"
        />
      <div className="time-remaining">
        <p>
          Closes {moment(getEndDate(selectedProcess), "YYYYMMDD").fromNow()}
        </p>
      </div>
    </div>
  );
}

export default ProcessSubheader;
