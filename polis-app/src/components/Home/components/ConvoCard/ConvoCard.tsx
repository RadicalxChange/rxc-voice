import React from "react";
import { Link } from "react-router-dom";
import moment from 'moment';

import "./ConvoCard.scss";

function ConvoCard(props:any) {

  return (
    <li className="conversation-card" key={props.conversation.id}>
      <Link
      to={`/conversation/${props.conversation.id}`}
      className="conversation-item"
      >
      <h3 className="title">{props.conversation.title}</h3>
      <p className="description">{props.conversation.description}</p>
      <p className="time-remaining">
        {(props.active ? "Closes " : "Closed ") + moment(props.conversation.end_date, "YYYYMMDD").fromNow()}
      </p>
      </Link>
    </li>
  );
}

export default ConvoCard;
