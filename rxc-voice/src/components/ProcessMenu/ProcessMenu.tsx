import React from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import { Process } from "../../models/Process";
import { Stage } from "../../models/Stage";

import "./ProcessMenu.scss";

function ProcessMenu(props: {process: Process}) {

  return (
    <ul className="menu">
      {props.process.stages
        .map((stage: Stage) => (
          <Link
          key={stage.position}
          to={`/${props.process.id}/${slugify(props.process.title)}/${stage.position}/${slugify(stage.title)}`}
          className="nav-stage"
          >
          {(+stage.position+1) + ". " + stage.title}
          </Link>
      ))}
    </ul>
  );
}

export default ProcessMenu;
