import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { Election } from "../../models/Election";
import { Proposal } from "../../models/Proposal";
import { VotingPageRouteParams } from "../../models/VotingPageRouteParams";
import { standInElection } from "../../utils";
import { WebService } from "../../services";
import "./VotingPage.scss";

function VotingPage() {
  const { id } = useParams<VotingPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  const [tokensRemaining, setTokensRemaining] = useState(0);
  const [proposals, setProposals] = useState(new Array<Proposal>());

  useEffect(() => {
    if (id) {
      WebService.fetchElection(id).subscribe((data) => {
        setElection(election => data);
        setTokensRemaining(tokensRemaining => data.num_tokens);
      });
      WebService.fetchProposals(id).subscribe((data: Proposal[]) => {
        setProposals(proposals => data);
      });
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const submitVote = () => {
  //
  // };

  return (
    <div className="voting-page">
      <div className="sticky-header">
        <h2>{election.title}</h2>
        <p>{election.description}</p>
        <div className="available-tokens-widget">
          <h3 className="available-tokens-text">Available Tokens</h3>
          <p className="tokens-remaining">
            {tokensRemaining}/{election.num_tokens} tokens remaining
          </p>
        </div>
      </div>
      <hr />
      <ul>
        {proposals.map((proposal: Proposal) => (
          <li>{proposal.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default VotingPage;
