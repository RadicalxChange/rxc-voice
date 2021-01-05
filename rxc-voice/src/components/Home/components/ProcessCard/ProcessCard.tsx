import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import init from '../../../../assets/bars/bar_initialization.svg';
import delg from '../../../../assets/bars/bar_delegation.svg';
import delb from '../../../../assets/bars/bar_delegation.svg';
import cur from '../../../../assets/bars/bar_curation.svg';
import elec from '../../../../assets/bars/bar_election.svg';
// import res from '../../../../assets/bars/bar_result.svg';
import { Status } from "../../../../models/Status";
import slugify from "react-slugify";
import { ActionContext } from "../../../../hooks";

import "./ProcessCard.scss";

function ProcessCard(props: any) {

  const [statusBar, setStatusBar] = useState(init)
  const { selectProcess } = useContext(ActionContext);

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

  const select = () => {
    selectProcess(props.process);
  }

  return (
    <li className="process-card" key={props.process.id}>
      <div className="process-item">
        <Link
        to={`/${props.process.id}/${slugify(props.process.title)}/${props.process.status}`}
        onClick={select}
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
        onClick={select}
        >
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
      </div>
    </li>
  );
}

export default ProcessCard;
