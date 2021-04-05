import React, { useState, useEffect, useReducer, useContext } from "react";
import { useParams } from "react-router-dom";
import moment from 'moment';
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import { Proposal } from "../../models/Proposal";
import { getElection, getId, getTitle, standInElection, standInResultData } from "../../utils";
import { WebService } from "../../services";
import { Vote } from "../../models/Vote";
import ProposalWidget from "./components/ProposalWidget";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import ProposalResults from "./components/ProposalResults";
import RemainingCredits from "./components/RemainingCredits";
import ProcessMenu from "../ProcessMenu/ProcessMenu";

import "./Election.scss";

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
  const [resultData, setResultData] = useState(standInResultData);
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
            console.log('hi')
          }
          WebService.fetchProposals(thisElection.id)
          .subscribe((data: Proposal[]) => {
            console.log(data);
            setProposals(proposals => data);
            var highestProposal = 0;
            var lowestProposal = 0;
            data.forEach(proposal => {
              let votesReceived = Number(proposal.votes_received);
              if (votesReceived > highestProposal) {
                highestProposal = votesReceived;
              } else if (votesReceived < lowestProposal) {
                lowestProposal = votesReceived;
              }
              voteDispatch({ proposal: proposal.id, amount: 0, });
            });
            setResultData({
              proposals: data,
              highestProposal: highestProposal,
              lowestProposal: lowestProposal,
            })
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
      <h2>loading...</h2>
    );
  } else if (moment() < moment(election.start_date)) {
    return (
      <div className="voting-page">
          <ProcessMenu />
        <div className="body">
          <h2>{getTitle(selectedProcess)}</h2>
          <p>This election begins {moment(election.start_date, "YYYYMMDD").fromNow()}</p>
        </div>
      </div>
    );
  } else if (moment() > moment(election.end_date)) {
    return (
      <div className="results-page">
          <ProcessMenu />
        <div className="body">
          <h2>{getTitle(selectedProcess)}</h2>
          <ProposalResults resultData={resultData} />
        </div>
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
            <ProcessMenu />
          <div className="button-container">
            <RemainingCredits
              creditsRemaining={creditsRemaining}
              creditBalance={creditBalance}
            />
            <label className="votes-cast">Total votes cast: {votesCast}</label>
            <button
              type="button"
              className="submit-button"
              onClick={() => submitVotes()}
              >
              submit votes
            </button>
          </div>
          <div className="body">
            <h2>{getTitle(selectedProcess)}</h2>
            <p>Spend your voice credits on the proposals you wish to support or oppose.</p>
            <p>This ballot was curated from proposals submitted by the delegation in the Deliberation Stage. You can go back and check the pol.is report to verify that the ballot accurately represents the delegation’s submissions. If Ballot Ratification receives a negative number of votes, the ballot will not be ratified, the election results will be overturned, and the ballot will have to be redrafted.</p>
            <ul className="proposal-list">
              {proposals.map((proposal: Proposal, i) => (
                <ProposalWidget key={i}
                                creditsRemaining={creditsRemaining}
                                proposal={proposal}
                                negativeVotes={election.negative_votes}
                                onChange={onChangeVoteCount} />
              ))}
            </ul>
          </div>
        </div>
    );
  }
}

export default Election;
