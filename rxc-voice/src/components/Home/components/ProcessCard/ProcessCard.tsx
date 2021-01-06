import React, { useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import slugify from "react-slugify";
import { ActionContext, StateContext } from "../../../../hooks";
import { getStatusBar } from "../../../../utils";

import "./ProcessCard.scss";

function ProcessCard(props: any) {
  const { selectProcess } = useContext(ActionContext);
  const { color } = useContext(StateContext);

  return (
    <li className="process-card" key={props.process.id}>
      <div className="process-item">
        <Link
        to={`/${props.process.id}/${slugify(props.process.title)}/${props.process.status}`}
        onClick={() => selectProcess(props.process)}
        >
          <h2 className="title">{props.process.title}</h2>
        </Link>
        <div className="stages">
          <Link
          to={`/${props.process.id}/${slugify(props.process.title)}/Initialization`}
          className="stage"
          >
          Initialization
          </Link>
          <Link
          to={`/${props.process.id}/${slugify(props.process.title)}/Delegation`}
          className="stage"
          >
          Delegation
          </Link>
          <Link
          to={`/${props.process.id}/${slugify(props.process.title)}/Deliberation`}
          className="stage"
          >
          Deliberation
          </Link>
          <Link
          to={`/${props.process.id}/${slugify(props.process.title)}/Curation`}
          className="stage"
          >
          Curation
          </Link>
          <Link
          to={`/${props.process.id}/${slugify(props.process.title)}/Election`}
          className="stage"
          >
          Election
          </Link>
        </div>
        <Link
        to={`/${props.process.id}/${slugify(props.process.title)}/${props.process.status}`}
        onClick={() => selectProcess(props.process)}
        >
          <img
            src={getStatusBar(props.process, color)}
            className="status-bar"
            alt="logo"
            />
          <div className="time-remaining">
            <p>
              Closes {moment(props.process.end_date, "YYYYMMDD").fromNow()}
            </p>
          </div>
        </Link>
      </div>
    </li>
  );
}

export default ProcessCard;
