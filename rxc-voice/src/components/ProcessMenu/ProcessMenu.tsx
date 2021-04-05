import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import slugify from "react-slugify";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import { getId, getTitle } from "../../utils";

import "./ProcessMenu.scss";

function ProcessMenu() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.White);
    if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
      selectProcess(processId);
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, selectedProcess]);

  return (
    <div className="menu">
      <Link
      to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Delegation`}
      className="nav-stage"
      >
      Delegation
      </Link>
      <Link
      to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Deliberation`}
      className="nav-stage"
      >
      Deliberation
      </Link>
      <Link
      to={`/${getId(selectedProcess)}/${slugify(getTitle(selectedProcess))}/Election`}
      className="nav-stage"
      >
      Election
      </Link>
    </div>
  );
}

export default ProcessMenu;
