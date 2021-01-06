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

function Election() {

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

  const initCredits: number = 0;
  const { processId } = useParams<ProcessPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  const [creditsRemaining, setCreditsRemaining] = useState(initCredits);
  const [proposals, setProposals] = useState(new Array<Proposal>());
  const [votes, voteDispatch] = useReducer(voteReducer, new Array<Vote>());
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.White);

    if (processId && (!selectedProcess || getId(selectedProcess) !== processId)) {
      selectProcess(processId);
    } else if (selectedProcess) {
      const thisElection = getElection(selectedProcess);
      if (election) {
        setElection(election => thisElection!);
        WebService.fetchProposals(election.id)
        .subscribe((data: Proposal[]) => {
          setProposals(proposals => data);
          data.forEach(proposal => {
            voteDispatch({ proposal: proposal.id, amount: 0, });
          });
        });
      }
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [processId, selectedProcess]);

  const onChangeVoteCount = (change: any) => {
    // console.log(change);
    setCreditsRemaining(creditsRemaining =>
      Number(creditsRemaining) - Number(change.cost));
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
    // console.log(postData);
    WebService.postVotes(postData, election.id).subscribe(async (data) => {
                    if (data.ok) {
                      // console.log("votes submitted!");
                    } else {
                      const error = await data.json();
                      Object.keys(error).forEach((key) => {
                        // console.log(error[key]);
                      });
                    }
                  });
  };

  if (moment() < moment(election.start_date)) {
    return (
      <div className="sticky-header">
        <h2>This election begins {moment(election.start_date, "YYYYMMDD").fromNow()}</h2>
      </div>
    );
  } else if (moment() > moment(election.end_date)) {
    return (
      <div className="sticky-header">
        <h2>Show results here.</h2>
      </div>
    );
  } else {
    return (
        <div className="voting-page">
          <div className="sticky-header">
            <h2 className="content-header">Election</h2>
            <div className="available-credits-widget">
              <h3 className="available-credits-text">Available Voice Credits</h3>
              <p className="credits-remaining">
                {creditsRemaining}/{WebService.userobj.credit_balance} voice credits remaining
              </p>
            </div>
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
}

export default Election;
