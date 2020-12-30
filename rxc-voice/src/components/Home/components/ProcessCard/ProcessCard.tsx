import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import init from '../../../../assets/bars/bar_initialization.svg'
import delg from '../../../../assets/bars/bar_delegation.svg'
import delb from '../../../../assets/bars/bar_delegation.svg'
import cur from '../../../../assets/bars/bar_curation.svg'
import elec from '../../../../assets/bars/bar_election.svg'
// import res from '../../../../assets/bars/bar_result.svg'
import { Status } from "../../../../models/Status";
import slugify from "react-slugify";

import "./ProcessCard.scss";

function ProcessCard(props: any) {

  const [statusBar, setStatusBar] = useState(init)

  useEffect(() => {
    switch (props.process.status) {
      case Status.Initialization: {
        setStatusBar(statusBar => init);
        break;
      }
      case Status.Delegation: {
        setStatusBar(statusBar => delg);
        break;
      }
      case Status.Deliberation: {
        setStatusBar(statusBar => delb);
        break;
      }
      case Status.Curation: {
        setStatusBar(statusBar => cur);
        break;
      }
      case Status.Election: {
        setStatusBar(statusBar => elec);
        break;
      }
      case undefined: {
        setStatusBar(statusBar => init);
        break;
      }
    };

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className="process-card" key={props.process.id}>
      <Link
      to={`/${props.process.id}/${slugify(props.process.title)}`}
      className="process-item"
      >
        <h2 className="title">{props.process.title}</h2>
        <div className="stages">
          <p className="stage">Initialization</p>
          <p className="stage">Delegation</p>
          <p className="stage">Deliberation</p>
          <p className="stage">Curation</p>
          <p className="stage">Election</p>
        </div>
        <img
          src={statusBar}
          className="status-bar"
          alt="logo"
          />
        <div className="time-remaining">
          <p>
            Closes {moment(props.process.end_date, "YYYYMMDD").fromNow()}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default ProcessCard;
