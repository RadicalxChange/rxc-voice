import React from "react";

import "./ProposalResults.scss";

function ProposalResults(props: any) {

  return (
    <li className="proposal-results">
      <label className="proposal-info">{props.proposal.title}</label>
      <div className="counter-container">
        <label>{props.proposal.votes_received}</label>
      </div>
    </li>
  );
}

export default ProposalResults;
