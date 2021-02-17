import React, { useState, useEffect, useReducer, useContext } from "react";
import { useParams } from "react-router-dom";
import moment from 'moment';
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import { Proposal } from "../../../../models/Proposal";
import { getElection, getId, standInElection } from "../../../../utils";
import { WebService } from "../../../../services";
import { Vote } from "../../../../models/Vote";
import ProposalWidget from "./components/ProposalWidget";
import { ActionContext, StateContext } from "../../../../hooks";

import "./Election.scss";
import { BgColor } from "../../../../models/BgColor";
import ProposalResults from "./components/ProposalResults";
import RemainingCredits from "./components/RemainingCredits";

function Election() {
  const [votesCast, setVotesCast] = useState(0);

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
      setVotesCast(votesCast + Math.abs(change.amount));
      return [...votes, newVote];
    } else {
      setVotesCast(votesCast - Math.abs(voteToChange.amount) + Math.abs(voteToChange.amount + change.amount));
      voteToChange.amount = voteToChange.amount + change.amount;
      return votes;
    }
  };

  const { selectedProcess, creditBalance } = useContext(StateContext);
  const { selectProcess, setColor, updateCreditBalance } = useContext(ActionContext);
  const { processId } = useParams<ProcessPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  const [creditsSpent, setCreditsSpent] = useState(0);
  const creditsRemaining = creditBalance ? (creditBalance! - creditsSpent) : 0
  const [proposals, setProposals] = useState(new Array<Proposal>());
  const [votes, voteDispatch] = useReducer(voteReducer, new Array<Vote>());
  const [viewResults, setViewResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setColor(BgColor.White);
    if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
      selectProcess(processId);
    } else if (selectedProcess) {
      const thisElection = getElection(selectedProcess);
      if (thisElection) {
        if (election.id !== thisElection.id) {
          setElection(election => thisElection!);
          if (thisElection.show_results) {
            setViewResults(true);
          }
          WebService.fetchProposals(thisElection.id)
          .subscribe((data: Proposal[]) => {
            data.sort((a: Proposal, b: Proposal) => {
              return Number(b.votes_received) - Number(a.votes_received);
            })
            setProposals(proposals => data);
            data.forEach(proposal => {
              voteDispatch({ proposal: proposal.id, amount: 0, });
            });
          });

          setLoading(false);
        }
      }
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [processId, selectedProcess]);

  const onChangeVoteCount = (change: any) => {
    setCreditsSpent(creditsSpent =>
      creditsSpent + Number(change.cost));
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
    WebService.postVotes(postData, election.id).subscribe(async (data) => {
                    if (data.ok) {
                      setViewResults(true);
                      selectProcess(processId);
                      if (creditBalance !== null) {
                        updateCreditBalance(creditsRemaining);
                      }
                    } else {
                      const error = await data.json();
                      Object.keys(error).forEach((key) => {
                        console.log(error[key]);
                      });
                    }
                  });
  };

  if (loading) {
    return (
      <div className="voting-page">
        <h2 className="content-header">loading...</h2>
      </div>
    );
  } else if (moment() < moment(election.start_date)) {
    return (
      <div className="voting-page">
        <div className="sticky-header">
          <h2 className="content-header">Election</h2>
          <p>This election begins {moment(election.start_date, "YYYYMMDD").fromNow()}</p>
        </div>
      </div>
    );
  } else if (moment() > moment(election.end_date)) {
    return (
      <div className="voting-page">
        <div className="sticky-header">
          <h2 className="content-header">Election Results</h2>
        </div>
        <ol>
          {proposals.map((proposal: Proposal, i) => (
            <ProposalResults key={i} proposal={proposal} />
          ))}
        </ol>
      </div>
    );
  } else if (viewResults) {
    return (
      <div className="voting-page">
        <div className="sticky-header">
          <h2 className="content-header">Election</h2>
          <p className="already-voted">Thanks for voting! The results will
            appear here when the election stage is over.
          </p>
        </div>
      </div>
    );
  } else {
    return (
        <div className="voting-page">
          <div className="sticky-header">
            <h2>Election</h2>
            <RemainingCredits
              creditsRemaining={creditsRemaining}
              creditBalance={creditBalance}
            />
          </div>
          <hr />
          <ul>
            {proposals.map((proposal: Proposal, i) => (
              <ProposalWidget key={i}
                              creditsRemaining={creditsRemaining}
                              proposal={proposal}
                              negativeVotes={election.negative_votes}
                              onChange={onChangeVoteCount} />
            ))}
          </ul>
          <div className="button-container">
            <label>Total votes cast: {votesCast}</label>
            <button
              type="button"
              className="submit-button"
              onClick={() => submitVotes()}
              >
              submit votes
            </button>
          </div>
        </div>
    );
  }
}

export default Election;
