import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";

import "./ProcessCard.scss";

function ProcessCard(props: any) {

  return (
    <li className="process-card" key={props.process.id}>
      <Link
      to={`/${props.process.id}/${slugify(props.process.title)}/${props.process.status}`}
      >
        <h2 className="title">{props.process.title}</h2>
        <p>{props.process.description}</p>
        <p className="time-remaining">
          {(props.active ? "Closes " : "Closed ") + moment(props.process.end_date, "YYYYMMDD").fromNow()}
        </p>
      </Link>
    </li>
  );
}

export default ProcessCard;
