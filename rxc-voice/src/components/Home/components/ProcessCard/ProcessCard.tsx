import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import slugify from "react-slugify";

import "./ProcessCard.scss";
import StatusBar from "../../../StatusBar";

function ProcessCard(props: any) {

  return (
    <li className="process-card" key={props.process.id}>
      <Link
      to={`/${props.process.id}/${slugify(props.process.title)}/${props.process.status}`}
      >
        <h2 className="title">{props.process.title}</h2>
      </Link>
      <StatusBar process={props.process}/>
      <div className="time-remaining">
        <p>
          Closes {moment(props.process.end_date, "YYYYMMDD").fromNow()}
        </p>
      </div>
    </li>
  );
}

export default ProcessCard;
