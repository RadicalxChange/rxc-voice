import React from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import moment from "moment";
import { Stage } from "../../../../models/Stage";


import "./ProcessCard.scss";

function ProcessCard(props: any) {
  const currentStage: Stage | undefined = props.process.stages.find((stage: Stage) => {
    return stage.position === props.process.curr_stage;
  });

  return (
    <li className="process-card" key={props.process.id}>
      <Link
      to={currentStage ? (
        `/${props.process.id}/${slugify(props.process.title)}/${currentStage.position}/${slugify(currentStage.title)}`
      ) : (
        `/${props.process.id}/${slugify(props.process.title)}}`
      )}
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
