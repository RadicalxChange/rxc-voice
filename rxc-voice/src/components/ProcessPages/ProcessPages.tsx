import React from "react";
import { useParams } from "react-router";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import { Status } from "../../models/Status";
import Curation from "./components/Curation";
import Delegation from "./components/Delegation";
import Deliberation from "./components/Deliberation";
import Election from "./components/Election";
import Initialization from "./components/Initialization";
import ProcessSubheader from "./components/ProcessSubheader";

import "./ProcessPages.scss";

function ProcessPages() {
  const { stage } = useParams<ProcessPageRouteParams>();


  switch (stage) {
    case Status.Initialization: {
      return (
        <><ProcessSubheader></ProcessSubheader>
          <Initialization></Initialization></>
      );
    }
    case Status.Delegation: {
      return (
        <><ProcessSubheader></ProcessSubheader>
        <Delegation></Delegation></>
      );
    }
    case Status.Deliberation: {
      return (
        <><ProcessSubheader></ProcessSubheader>
        <Deliberation></Deliberation></>
      );
    }
    case Status.Curation: {
      return (
        <><ProcessSubheader></ProcessSubheader>
        <Curation></Curation></>
      );
    }
    case Status.Election: {
      return (
        <><ProcessSubheader></ProcessSubheader>
        <Election></Election></>
      );
    }
    case undefined: {
      return (
        <h2>Process not found. Return to home.</h2>
      );
    }
  }
}

export default ProcessPages;
