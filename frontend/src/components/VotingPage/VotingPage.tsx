import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import moment from 'moment';
import { Proposal } from "../../models/Proposal";
import { VotingPageRouteParams } from "../../models/VotingPageRouteParams";
import { standInElection, defaultPermission } from "../../utils";
import { Permission } from "../../models/Permission";
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
  const { electionId, userId } = useParams<VotingPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  const [tokensRemaining, setTokensRemaining] = useState(initTokens);
  const [proposals, setProposals] = useState(new Array<Proposal>());
  const [votes, voteDispatch] = useReducer(voteReducer, new Array<Vote>());
  const [permission, setPermission] = useState(defaultPermission);

  useEffect(() => {
    if (userId && electionId) {
      WebService.loginUser({
        username: userId,
        password: userId,
      }).subscribe(async (data) => {
        if (data.ok) {
          const user = await data.json();
          sessionStorage.setItem("user", JSON.stringify(user));
          console.log(user);
          WebService.fetchElection(electionId)
          .subscribe(async (data) => {
            if (data.id) {
              setElection(election => data);
              console.log(data.show_results);
              if (data.show_results) {
                setPermission(permission => Permission.View_Results);
              } else {
                setPermission(permission => Permission.Vote);
                setTokensRemaining(tokensRemaining => data.num_tokens);
              }
            }
          });
          WebService.fetchProposals(electionId)
          .subscribe((data: Proposal[]) => {
            setProposals(proposals => data);
            data.forEach(proposal => {
              voteDispatch({ proposal: proposal.id, amount: 0, });
            });
          });
        } else {
          const error = await data.json();
          console.log(error);
        }
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
    const user = sessionStorage.getItem("user");
    votes.forEach(vote => postData.push({
      proposal: vote.proposal,
      amount: vote.amount,
      date: moment().format('YYYY-MM-DDTHH:MM'),
      sender: user ? JSON.parse(user).id : '',
    }));
    console.log(postData);
    WebService.postVotes(postData, election.id).subscribe(async (data) => {
                    if (data.ok) {
                      console.log("votes submitted!");
                    } else {
                      const error = await data.json();
                      Object.keys(error).forEach((key) => {
                        console.log(error[key]);
                      });
                    }
                  });
  };

  if (permission === Permission.Vote) {
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
  } else if (permission === Permission.View_Results) {
    return (
      <div className="sticky-header">
        <h2>Results will show up here as votes come in...</h2>
      </div>
    )
  } else {
    return (
      <div className="sticky-header">
        <h2>Sorry! You do not have access to this private election.</h2>
      </div>
    )
  }
}

export default VotingPage;
