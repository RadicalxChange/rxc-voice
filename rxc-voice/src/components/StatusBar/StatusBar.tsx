import React, { useContext } from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import { StateContext } from "../../hooks";
import { Status } from "../../models/Status";
import { getId, getTitle } from "../../utils";

import "./StatusBar.scss";

function StatusBar(props: any) {
  const { color } = useContext(StateContext);

  return (
    <div className="status-bar-container">
      <div className="stages">
        <Link
        to={`/${getId(props.process)}/${slugify(getTitle(props.process))}/Delegation`}
        className={`stage ${props.stage === Status.Delegation ? "selected-stage" : ""}`}
        >
        Delegation
        </Link>
        <Link
        to={`/${getId(props.process)}/${slugify(getTitle(props.process))}/Deliberation`}
        className={`stage ${props.stage === Status.Deliberation ? "selected-stage" : ""}`}
        >
        Deliberation
        </Link>
        <Link
        to={`/${getId(props.process)}/${slugify(getTitle(props.process))}/Election`}
        className={`stage ${props.stage === Status.Election ? "selected-stage" : ""}`}
        >
        Election
        </Link>
      </div>
      <svg className="status-bar" width="288" height="22" viewBox="0 0 288 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="140" cy="11" r="6" fill="none" stroke="black"/>
        <circle cx="273" cy="11" r="6" fill="none" stroke="black"/>
        <rect x="1" y="9.5" width="139" height="3" rx="5.5" fill="none" stroke="black"/>
        <rect x="1" y="9.5" width="139" height="3" rx="5.5" fill={`${(props.process.status === Status.Delegation) ? color : "black"}`} stroke="black"/>
        <circle cx="7" cy="11" r="6" fill="black" stroke="black"/>
        <rect x="140" y="9.5" width="139" height="3" rx="5.5" fill={`${(props.process.status === Status.Election) ? "black" : color}`} stroke="black"/>
        <circle cx="140" cy="11" r="5.5" fill={`${(props.process.status === Status.Delegation) ? color : "black"}`} stroke={`${(props.process.status === Status.Delegation) ? "none" : "black"}`} />
        <circle cx="273" cy="11" r="5.5" fill={`${(props.process.status === Status.Election) ? "black" : color}`} stroke={`${(props.process.status === Status.Election) ? "black" : "none"}`} />
      </svg>
    </div>
  );
}

export default StatusBar;
