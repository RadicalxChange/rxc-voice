import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import moment from "moment";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { Process } from "../../../../models/Process";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import init from '../../../../assets/bars/bar_initialization.svg';
import delg from '../../../../assets/bars/bar_delegation.svg';
import delb from '../../../../assets/bars/bar_delegation.svg';
import cur from '../../../../assets/bars/bar_curation.svg';
import elec from '../../../../assets/bars/bar_election.svg';

import "./Initialization.scss";
import { Status } from "../../../../models/Status";

function Initialization() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);

  const getTitle = (process: Process | null) => {
    if (process) {
      return process.title;
    } else {
      return undefined;
    }
  };

  const getId = (process: Process | null) => {
    if (process) {
      return process.id;
    } else {
      return undefined;
    }
  };

  const getEndDate = (process: Process | null) => {
    if (process) {
      return process.end_date;
    } else {
      return undefined;
    }
  };

  const getDescription = (process: Process | null) => {
    if (process) {
      return process.description;
    } else {
      return undefined;
    }
  };

  const getStatusBar = (process: Process | null) => {
    if (process) {
      switch (process.status) {
        case Status.Initialization: {
          return init;
        }
        case Status.Delegation: {
          return delg;
        }
        case Status.Deliberation: {
          return delb;
        }
        case Status.Curation: {
          return cur;
        }
        case Status.Election: {
          return elec;
        }
        case undefined: {
          return undefined;
        }
      }
    } else {
      return undefined;
    }
  };


  useEffect(() => {
    setColor(BgColor.Yellow);
    if (processId && !selectedProcess) {
      selectProcess(processId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  return (
    selectedProcess ? (
      <div className="init-page">
        <h1 className="title">{getTitle(selectedProcess)}</h1>
        <div className="stages">
          <Link
          to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Initialization`}
          className="stage"
          >
          Initialization
          </Link>
          <Link
          to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Delegation`}
          className="stage"
          >
          Delegation
          </Link>
          <Link
          to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Deliberation`}
          className="stage"
          >
          Deliberation
          </Link>
          <Link
          to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Curation`}
          className="stage"
          >
          Curation
          </Link>
          <Link
          to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Election`}
          className="stage"
          >
          Election
          </Link>
        </div>
        <img
          src={getStatusBar(selectedProcess)}
          className="status-bar"
          alt="logo"
          />
        <div className="time-remaining">
          <p>
            Closes {moment(getEndDate(selectedProcess), "YYYYMMDD").fromNow()}
          </p>
        </div>
        <h2 className="content-header">Initialization</h2>
        <p>{getDescription(selectedProcess)}</p>

      </div>
    ) : (
      <h1>Process not found. Return to home.</h1>
    )
  );
}

export default Initialization;
