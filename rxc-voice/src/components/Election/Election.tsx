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
  const [ratProposal, setRatProposal] = useState({exists: false, index: 0});
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
          }
          WebService.fetchProposals(thisElection.id)
          .subscribe((data: Proposal[]) => {
            var highestProposal = 0;
            var lowestProposal = 0;
            var ratificationIndex: number | undefined = undefined;
            data.forEach((proposal, i) => {
              if (proposal.ballot_ratification) {
                ratificationIndex = i;
              }
              let votesReceived = Number(proposal.votes_received);
              if (votesReceived > highestProposal) {
                highestProposal = votesReceived;
              } else if (votesReceived < lowestProposal) {
                lowestProposal = votesReceived;
              }
              voteDispatch({ proposal: proposal.id, amount: 0, });
            });
            if (ratificationIndex) {
              setRatProposal({exists: true, index: ratificationIndex});
            } else {
              setRatProposal({exists: false, index: 0});
            }
            setProposals(proposals => data);
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

  const notRatProposal = (proposal: Proposal, index, array) => {
   return !proposal.ballot_ratification;
  };

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
          <h1>Election</h1>
          <h2>{getTitle(selectedProcess)}</h2>
          <p className="explain-text"><strong>The Election Stage begins on {moment(election.start_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
        </div>
      </div>
    );
  } else if (moment() > moment(election.end_date)) {
    return (
      <div className="results-page">
        <ProcessMenu />
        <div className="body">
          <h1>Election Results</h1>
          <h2>{getTitle(selectedProcess)}</h2>
          <p className="explain-text"><strong>The Election Stage has concluded. You can see the results below!</strong></p>
          <ProposalResults resultData={resultData} />
        </div>
      </div>
    );
  } else if (viewResults) {
    return (
      <div className="voting-page">
        <ProcessMenu />
        <div className="body">
          <h1>Election</h1>
          <h2>{getTitle(selectedProcess)}</h2>
          <p className="explain-text"><strong>The Election Stage closes on {moment(election.end_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
          <p>Thanks for voting! The results will
            appear here when the election stage is over.
          </p>
        </div>
      </div>
    );
  } else {
    return (
        <div className="voting-page">
          <ProcessMenu />
          {(creditBalance && (creditBalance! >= 25)) ? (
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
          ) : null}
          <div className="body">
            <h1>Election</h1>
            <h2>{getTitle(selectedProcess)}</h2>
            <div className="explain-text">
              <p>Spend your voice credits on the proposals you wish to support or oppose.</p>
              <p>This ballot was curated from proposals submitted by the delegation in the Deliberation Stage. You can go back and check the pol.is report to verify that the ballot fairly and accurately represents the delegation’s submissions. Make sure you use some of your voice credits to support or oppose the Ballot Ratification proposal accordingly.</p>
              <p>If Ballot Ratification receives a negative number of votes, the ballot will not be ratified, the election results will be overturned, and the ballot will have to be redrafted.</p>
            </div>
            <p className="explain-text"><strong>The Election Stage closes on {moment(election.end_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
            {(creditBalance && (creditBalance! >= 25)) ? (
            <ul className="proposal-list">
              {ratProposal.exists === true && proposals[ratProposal.index] ? (
                <ProposalWidget key={ratProposal.index}
                                creditsRemaining={creditsRemaining}
                                proposal={proposals[ratProposal.index]}
                                negativeVotes={election.negative_votes}
                                onChange={onChangeVoteCount} />
              ) : null}
              {proposals.filter(notRatProposal).map((proposal: Proposal, i) => (
                <ProposalWidget key={i}
                                creditsRemaining={creditsRemaining}
                                proposal={proposal}
                                negativeVotes={election.negative_votes}
                                onChange={onChangeVoteCount} />
              ))}
            </ul>
            ) : (
              <p className="insufficient-credits">Sorry! You do not have enough voice credits to participate in Deliberation or Election. The threshold for participation is 25 voice credits.</p>
            )}
          </div>
        </div>
    );
  }
}

export default Election;
