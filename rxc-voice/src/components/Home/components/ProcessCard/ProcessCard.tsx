import React from "react";
import { Link } from "react-router-dom";

import "./ProcessCard.scss";

function ProcessCard(props: any) {

  return (
    <li className="process-card" key={props.process.id}>
      <Link
      to={`/processes/${props.process.id}`}
      className="process-item"
      >
        <h3 className="title">{props.process.title}</h3>
      </Link>
    </li>
  );
}

export default ProcessCard;
