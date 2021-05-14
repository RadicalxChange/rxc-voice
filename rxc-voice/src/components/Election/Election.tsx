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

  function proposalReducer(proposals: any[], change: any) {
    const proposalToChange: any | undefined = proposals.find(
      proposal => proposal.id === change.id);
    if (proposalToChange === undefined) {
      const newProposal: any = change;
      setVotesCast(votesCast + Math.abs(change.amount));
      setCreditsSpent(creditsSpent + change.cost);
      return [...proposals, newProposal];
    } else {
      setVotesCast(votesCast - Math.abs(proposalToChange.amount) + Math.abs(proposalToChange.amount + change.amount));
      setCreditsSpent(creditsSpent + change.cost);
      proposalToChange.amount = proposalToChange.amount + change.amount;
      return proposals;
    }
  };

  const { selectedProcess, creditBalance } = useContext(StateContext);
  const { selectProcess, setColor, updateCreditBalance } = useContext(ActionContext);
  const { processId } = useParams<ProcessPageRouteParams>();
  const [election, setElection] = useState(standInElection);
  const [creditsSpent, setCreditsSpent] = useState(0);
  const [startingBalance, setStartingBalance] = useState(0);
  const [proposals, proposalDispatch] = useReducer(proposalReducer, new Array<any>());
  const [ratProposal, setRatProposal] = useState({exists: false, index: 0});
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [changingVotes, setChangingVotes] = useState(false);
  const [success, setSuccess] = useState(false);
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
          setElection(thisElection!);
          if (thisElection.show_results) {
            setAlreadyVoted(true);
          }
          WebService.fetchProposals(thisElection.id)
          .subscribe((data: Proposal[]) => {
            processProposalData(data);
          });
          setLoading(false);
        }
      }
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [processId, selectedProcess]);

  const processProposalData = (data: any) => {
    const proposalData = data.proposals;
    const voteData = data.votes;
    var highestProposal = 0;
    var lowestProposal = 0;
    var ratificationIndex: number | undefined = undefined;
    var spentPreviously: number = 0;
    proposalData.forEach((proposal, i) => {
      if (proposal.ballot_ratification) {
        ratificationIndex = i;
      }
      let votesReceived = Number(proposal.votes_received);
      if (votesReceived > highestProposal) {
        highestProposal = votesReceived;
      } else if (votesReceived < lowestProposal) {
        lowestProposal = votesReceived;
      }
      const vote: Vote | undefined = voteData.find(
        vote => vote.proposal === proposal.id);
      const amount = vote ? vote.amount : 0;
      proposalDispatch({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        link: proposal.link,
        ballot_ratification: proposal.ballot_ratification,
        votes_received: proposal.votes_received,
        amount: +amount,
        cost: Math.pow(+amount, 2)
      });
      spentPreviously += Math.pow(+amount, 2);
    });
    setStartingBalance(creditBalance ? +creditBalance! + spentPreviously : 0)
    if (ratificationIndex) {
      setRatProposal({exists: true, index: ratificationIndex});
    } else {
      setRatProposal({exists: false, index: 0});
    }
    setResultData({
      proposals: proposalData,
      highestProposal: highestProposal,
      lowestProposal: lowestProposal,
    })
  };

  const notRatProposal = (proposal: Proposal, index, array) => {
   return !proposal.ballot_ratification;
  };

  const submitVotes = () => {
    const postData = new Array<any>();
    const user = sessionStorage.getItem("user");
    proposals.forEach(proposal => postData.push({
      proposal: proposal.id,
      amount: proposal.amount,
      date: moment().format('YYYY-MM-DDTHH:MM'),
      sender: user ? JSON.parse(user).id : '',
    }));
    WebService.postVotes(postData, election.id).subscribe(async (data) => {
                    if (data.ok) {
                      setAlreadyVoted(true);
                      selectProcess(processId);
                      if (creditBalance !== null) {
                        updateCreditBalance(startingBalance - creditsSpent);
                      }
                      setSuccess(true);
                      setChangingVotes(false);
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
  } else if (alreadyVoted && !changingVotes) {
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
          <button
            type="button"
            className="submit-button"
            onClick={() => setChangingVotes(true)}
            >
            Change Your Votes
          </button>
          <div className="modal">
            <div className={`success-modal ${!success ? "closed" : ""}`}>
              <h2>Success!</h2>
              <div className="explain-text">
                  <p>Your votes are in. You'll be able to change your votes up until the Election Stage closes.</p>
              </div>
              <button
                type="button"
                className="submit-button"
                onClick={() => setSuccess(false)}
                >
                Close
              </button>
            </div>
            <div
              className={`modal-overlay ${!success ? "closed" : ""}`}
              onClick={() => setSuccess(false)}
            ></div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
        <div className="voting-page">
          <ProcessMenu />
          {((creditBalance && (creditBalance! >= 25)) || alreadyVoted) ? (
            <div className="button-container">
              <RemainingCredits
                creditsRemaining={startingBalance - creditsSpent}
                creditBalance={startingBalance}
              />
              <label className="votes-cast">Total votes cast: {votesCast}</label>
              <button
                type="button"
                className="submit-button"
                onClick={() => submitVotes()}
                >
                Save Votes
              </button>
              {alreadyVoted ? (
                <button
                  type="button"
                  className="submit-button"
                  onClick={() => setChangingVotes(false)}
                  >
                  Cancel
                </button>
              ) : null}
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
            {((creditBalance && (creditBalance! >= 25)) || alreadyVoted) ? (
            <ul className="proposal-list">
              {ratProposal.exists === true && proposals[ratProposal.index] ? (
                <ProposalWidget key={ratProposal.index}
                                creditsRemaining={startingBalance - creditsSpent}
                                proposal={proposals[ratProposal.index]}
                                negativeVotes={election.negative_votes}
                                onChange={proposalDispatch} />
              ) : null}
              {proposals
                .filter(notRatProposal)
                .sort((a: Proposal, b: Proposal) => {
                  return a.title.localeCompare(b.title);
                })
                .map((proposal: Proposal, i) => (
                <ProposalWidget key={i}
                                creditsRemaining={startingBalance - creditsSpent}
                                proposal={proposal}
                                negativeVotes={election.negative_votes}
                                onChange={proposalDispatch} />
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
