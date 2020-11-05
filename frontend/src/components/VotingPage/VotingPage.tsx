import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
// import { Election } from "../../models/Election";
import { Proposal } from "../../models/Proposal";
import { VotingPageRouteParams } from "../../models/VotingPageRouteParams";
import { standInElection } from "../../utils";
import { WebService } from "../../services";
import { Vote } from "../../models/Vote";
import "./VotingPage.scss";
import ProposalWidget from "./components/ProposalWidget";

function VotingPage() {

  function voteReducer(votes: Vote[], change: any) {
    const voteToChange: Vote | undefined = votes.find(
      vote => vote.proposal === change.proposal);
    if (voteToChange === undefined) {
      const newVote: Vote = { id: 0,
                              sender: '',
                              proposal: change.proposal,
                              amount: change.amount,
                              date: '',
                            };
      return [...votes, newVote];
    } else {
      voteToChange.amount = voteToChange.amount + change.amount;
      return votes;
    }
  };

  const initTokens: number = 0;
  const { id } = useParams<VotingPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  const [tokensRemaining, setTokensRemaining] = useState(initTokens);
  const [proposals, setProposals] = useState(new Array<Proposal>());
  const [votes, voteDispatch] = useReducer(voteReducer, new Array<Vote>());

  useEffect(() => {
    if (id) {
      WebService.fetchElection(id).subscribe((data) => {
        setElection(election => data);
        setTokensRemaining(tokensRemaining => data.num_tokens);
      });
      WebService.fetchProposals(id).subscribe((data: Proposal[]) => {
        setProposals(proposals => data);
        data.forEach(proposal => {
          voteDispatch({ proposal: proposal.id, amount: 0, });
        });
      });
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeVoteCount = (change: any) => {
    console.log(change);
    setTokensRemaining(tokensRemaining =>
      Number(tokensRemaining) - Number(change.cost));
    voteDispatch({ proposal: change.proposal, amount: change.amount, });
  };

  const submitVotes = () => {
    const postData = new Array<any>();
    votes.forEach(vote => postData.push({
      proposal: vote.proposal,
      amount: vote.amount,
    }));
    console.log(postData);
    WebService.postVotes(postData, election.id).subscribe(async (data) => {
                    if (data.ok) {
                      console.log("votes submitted!");
                    } else {
                      const error = await data.json();
                      Object.keys(error).forEach((key) => {
                        console.log(error[key].join());
                      });
                    }
                  });
  };

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
        {proposals.map((proposal: Proposal, i) => (
          <ProposalWidget key={i}
                          tokensRemaining={tokensRemaining}
                          proposal={proposal}
                          negativeVotes={election.negative_votes}
                          onChange={onChangeVoteCount} />
        ))}
      </ul>
      <div className="button-wrapper">
        <button
          type="button"
          className="submit-button"
          onClick={() => submitVotes()}
          >
          submit
        </button>
      </div>
    </div>
  );
}

export default VotingPage;
