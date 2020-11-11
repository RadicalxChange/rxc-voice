import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import moment from 'moment';
// import { Election } from "../../models/Election";
import { Proposal } from "../../models/Proposal";
import { VotingPageRouteParams } from "../../models/VotingPageRouteParams";
import { standInElection, standInVoter, defaultPermission } from "../../utils";
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
  const { email, userId } = useParams<VotingPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  // const [voter, setVoter] = useState(standInVoter);
  const [tokensRemaining, setTokensRemaining] = useState(initTokens);
  const [proposals, setProposals] = useState(new Array<Proposal>());
  const [votes, voteDispatch] = useReducer(voteReducer, new Array<Vote>());
  const [permission, setPermission] = useState(defaultPermission);

  useEffect(() => {
    if (userId) {
      console.log({email: email, password: userId,});
      WebService.loginUser({email: email, password: userId,}).subscribe(async (data) => {
        if (data.ok) {
          const user = await data.json();
          sessionStorage.setItem("user", JSON.stringify(user));
          const election_id = user.election;
          if (election_id) {
            WebService.fetchElection(election_id).subscribe(async (data) => {
              if (data.id) {
                setElection(election => data);
                setTokensRemaining(tokensRemaining => data.num_tokens);
                if (!user.voted) {
                  setPermission(permission => Permission.Vote);
                } else {
                  setPermission(permission => Permission.View);
                }
              }
            });
            WebService.fetchProposals(election_id).subscribe((data: Proposal[]) => {
              setProposals(proposals => data);
              data.forEach(proposal => {
                voteDispatch({ proposal: proposal.id, amount: 0, });
              });
            });
          }
        } else {
          const error = await data.json();
          console.log("yo");
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
      sender: user,
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
    // WebService.updateVoter(userId, {voted: true})
    //       .subscribe(async (data) => {
    //         if (!data.ok) {
    //           console.error("Error", await data.json());
    //         }
    //       });
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
  } else {
    return (
      <div className="sticky-header">
        <h2>Sorry! You do not have access to this private election.</h2>
      </div>
    )
  }
}

export default VotingPage;
