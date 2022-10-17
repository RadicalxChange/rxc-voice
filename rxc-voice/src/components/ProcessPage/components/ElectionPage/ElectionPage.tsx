import React, { useState, useEffect, useReducer, useContext } from "react";
import moment from 'moment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Proposal } from "../../../../models/Proposal";
import { getUserData, updateCreditBalance } from "../../../../utils";
import { WebService } from "../../../../services";
import { Vote } from "../../../../models/Vote";
import ProposalWidget from "./components/ProposalWidget";
import ProposalResults from "./components/ProposalResults";
import RemainingCredits from "./components/RemainingCredits";
import { Process } from "../../../../models/Process";
import { Election } from "../../../../models/Stage";
import { User } from "../../../../models/User";
import { Delegate } from "../../../../models/Delegate";
import { ActionContext } from "../../../../hooks";
import { ResultData } from "../../../../models/ResultData";

import "./ElectionPage.scss";

function ElectionPage(props: {process: Process, election: Election, userDelegate: Delegate}) {

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

  const { selectProcess, setUserData } = useContext(ActionContext);
  const [creditsSpent, setCreditsSpent] = useState(0);
  const [startingBalance, setStartingBalance] = useState(+props.userDelegate.credit_balance);
  const [proposals, proposalDispatch] = useReducer(proposalReducer, new Array<any>());
  const [ratProposal, setRatProposal] = useState<number | undefined>(undefined);
  const [changingVotes, setChangingVotes] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultData, setResultData] = useState<ResultData | undefined>(undefined);
  const [alreadyVoted, setAlreadyVoted] = useState(props.election.show_results);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WebService.fetchProposals(props.election.id)
    .subscribe((data: Proposal[]) => {
      processProposalData(data);
    });
    setLoading(false);

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

  const processProposalData = (data: any) => {
    const proposalData = data.proposals;
    const voteData = data.votes;
    var highestProposal = 0;
    var lowestProposal = 0;
    var ratificationIndex: number | undefined;
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
        credits_received: proposal.credits_received,
        amount: +amount,
        cost: Math.pow(+amount, 2)
      });
      spentPreviously += Math.pow(+amount, 2);
    });
    setStartingBalance(currentBalance => currentBalance + spentPreviously);
    if (ratificationIndex) {
      setRatProposal(ratificationIndex);
    }
    setResultData({
      proposals: proposalData,
      highestProposal: highestProposal,
      lowestProposal: lowestProposal,
    })
  };

  const notRatProposal = (proposal: Proposal, index: number, array: Proposal[]) => {
   return index !== ratProposal;
  };

  const submitVotes = (userDelegate: Delegate) => {
    const postData = new Array<any>();
    proposals.forEach(proposal => postData.push({
      proposal: proposal.id,
      amount: proposal.amount,
      date: moment().format('YYYY-MM-DDTHH:MM'),
      sender: userDelegate.id,
    }));
    WebService.postVotes(postData, props.election.id).subscribe(async (data) => {
                    if (data.ok) {
                      setAlreadyVoted(true);
                      props.election.show_results = true;
                      selectProcess(props.process.id);
                      const user: User | undefined = getUserData();
                      if (user) {
                        const userData = updateCreditBalance(user, props.process, startingBalance - creditsSpent);
                        setUserData(userData);
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

  // const shuffle = (array: any[]) => {
  //   var currentIndex = array.length,  randomIndex;
  //
  //   // While there remain elements to shuffle...
  //   while (0 !== currentIndex) {
  //
  //     // Pick a remaining element...
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex--;
  //
  //     // And swap it with the current element.
  //     [array[currentIndex], array[randomIndex]] = [
  //       array[randomIndex], array[currentIndex]];
  //   }
  //
  //   return array;
  // }

  const downloadXLSX = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    var rows = new Array<any>();
    proposals.forEach((proposal: Proposal) => {
      rows.push({
        title: proposal.title,
        description: proposal.description,
        link: proposal.link,
        effective_votes: proposal.votes_received,
        credits_received: proposal.credits_received,
      })
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(fileData, 'rxc-voice-results' + fileExtension);
  };

  if (loading) {
    return (
      <h2>loading...</h2>
    );
  } else if (moment() < moment(props.election.start_date)) {
    return (
      <div className="voting-page">
        <h1>Voting</h1>
        <h2 className="content-header">{props.process.title}</h2>
        <p className="explain-text"><strong>The Voting Stage begins on {moment(props.election.start_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
      </div>
    );
  } else if (moment() > moment(props.election.end_date)) {
    return (
      <div className="results-page">
        <h1>Election Results</h1>
        <h2 className="content-header">{props.process.title}</h2>
        <p className="explain-text"><strong>The Voting Stage has concluded. You can see the results below!</strong></p>
        <button onClick={downloadXLSX} id="download" className="submit-button">
          Download spreadsheet
        </button>
        {resultData ? (
          <ProposalResults resultData={resultData} />
        ) : null}
      </div>
    );
  } else if (alreadyVoted && !changingVotes) {
    return (
      <div className="voting-page">
        <h1>Election</h1>
        <h2 className="content-header">{props.process.title}</h2>
        <p className="explain-text"><strong>The Voting Stage closes on {moment(props.election.end_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
        <p className="explain-text">Thanks for voting! The results will
          appear here when the voting stage is over.
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
                <p>Your votes are in. You'll be able to change your votes up until the Voting Stage closes.</p>
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
    );
  } else {
    return (
      <div className="voting-page">
        {props.userDelegate ? (
          <>
          {+props.userDelegate.credit_balance >= 25 || alreadyVoted ? (
            <div className="button-container">
              <RemainingCredits
                creditsRemaining={startingBalance - creditsSpent}
                creditBalance={startingBalance}
              />
              <label className="votes-cast">Total votes cast: {votesCast}</label>
              <button
                type="button"
                className="submit-button"
                onClick={() => submitVotes(props.userDelegate)}
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
          <h1>Election</h1>
          <h2 className="content-header">{props.process.title}</h2>
          <div className="explain-text">
            <p>Each of the 8 proposals are listed below. The first 7 are simply yes/no votes (vote up/vote down). The last one, Proposal 8 has 4 parts. You vote on each separately (this will determine the dilution ratio for different classes of users).</p>
            <p>Spend your voice credits on the proposals you wish to support or oppose. You have multiple voting credits (see the number on the right column). How you spend those is up to you. If you strongly believe / oppose something, vote multiple times, up to your credit limit. Vote UP to vote YES. Vote DOWN (casting negative votes) to vote NO. Skip it (casting zero votes) to abstain.</p>
            <p>This ballot was curated from proposals submitted by the delegation in the Deliberation Stage. You can use the menu on the left (or at the bottom of your screen if you're on mobile) to go back and check the pol.is report and verify that the ballot fairly and accurately represents the delegation’s submissions. Make sure you use some of your voice credits to support or oppose the Ballot Ratification proposal accordingly.</p>
            <p>If Ballot Ratification receives a negative number of votes, the ballot will not be ratified, the election results will be overturned, and the ballot will have to be redrafted.</p>
            <p>After you submit your votes, you can go back, make changes, and resubmit at any time.</p>
          </div>
          <p className="explain-text"><strong>The Voting Stage closes on {moment(props.election.end_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
          {+props.userDelegate.credit_balance >= 25 || alreadyVoted ? (
          <ul className="proposal-list">
            {ratProposal && proposals[ratProposal] ? (
              <ProposalWidget key={proposals[ratProposal].id}
                              creditsRemaining={startingBalance - creditsSpent}
                              proposal={proposals[ratProposal]}
                              negativeVotes={props.election.negative_votes}
                              onChange={proposalDispatch} />
            ) : null}
            {proposals
              .filter(notRatProposal)
              .sort((a, b) => a.title[14] - b.title[14])
              .map((proposal: Proposal, i) => (
              <ProposalWidget key={proposal.id}
                              creditsRemaining={startingBalance - creditsSpent}
                              proposal={proposal}
                              negativeVotes={props.election.negative_votes}
                              onChange={proposalDispatch} />
            ))}
          </ul>
          ) : (
            <p className="insufficient-credits">Sorry! You do not have enough voice credits to participate in Deliberation or Election. The threshold for participation is 25 voice credits.</p>
          )}
          </>
        ) : (
          <h3>Sorry, something went wrong. Head back to home to find what you're looking for.</h3>
        )}
      </div>
    );
  }
}

export default ElectionPage;
