import React, { useContext, useEffect, useState } from "react";
import { ActionContext, StateContext } from "../../../../hooks/AppProvider";
import moment from "moment";
import { Election } from "../../../../models/Stage";
import { BgColor } from "../../../../models/BgColor";
import { Proposal } from "../../../../models/Proposal";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import { useParams } from "react-router";
import { WebService } from "../../../../services";
import { getStageByPosition } from "../../../../utils";

import "./EventManager.scss";

function EventManager() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { setColor, selectProcess } = useContext(ActionContext);
  const { selectedProcess } = useContext(StateContext);
  const [newProposal, setNewProposal] = useState("");
  const [proposals, setProposals] = useState(new Array<Proposal>())
  const [addingProposal, setAddingProposal] = useState(false);
  const [election, setElection] = useState<Election | undefined>(undefined)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setColor(BgColor.White);
    // if data for this process is not yet loaded, load it
    if (selectedProcess?.id !== +processId) {
      selectProcess(processId);
    } else if (selectedProcess) {
      // once we have all the process data, load the election data and proposals
      const election = getStageByPosition(2, selectedProcess);
      if (election) {
        setElection(election);
        loadProposals(election.id);
      }
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, selectedProcess]);

  // add a proposal to the ballot
  const addProposal = (e: any, election: Election) => {
    e.preventDefault();
    if (selectedProcess && newProposal) {
      const proposalData = {
        title: newProposal,
        ballot_ratification: false,
        election: election.id,
        credits_received: 0,
        votes_received: 0,
      }
      WebService.postProposal(election.id, proposalData).subscribe(async (data) => {
        if (data.ok) {
          loadProposals(election.id);
        } else {
          const error = await data.json();
          Object.keys(error).forEach((key) => {
            console.log(error[key]);
          });
        }
      });
    }
  };

  // delete a proposal from the ballot
  const deleteProposal = (proposalId: number, election: Election) => {
    if (selectedProcess) {
      WebService.deleteProposal(proposalId).subscribe(async (data) => {
        if (data.ok) {
          loadProposals(election.id);
        } else {
          const error = await data.json();
          Object.keys(error).forEach((key) => {
            console.log(error[key]);
          });
        }
      });
    }
  };

  // load proposals for this election
  const loadProposals = (electionId: any) => {
    setNewProposal("");
    setAddingProposal(false);
    WebService.fetchProposals(electionId)
    .subscribe((data: any) => {
      const sortedProposals = data.proposals.sort((a: Proposal, b: Proposal) => {
        return a.id - b.id;
      });
      setProposals(sortedProposals);
    });
  };

  return (
    <>
    {!loading ? (
      selectedProcess && election ? (
        <div className="create-event">
          <div className="create-event_header">
            <h1>Event Manager</h1>
            <p>{selectedProcess.title}</p>
          </div>
          <h2>Election</h2>
          {moment() < moment(election.end_date) ? (
            <>
            <p>Manage the ballot for the election stage of this event.</p>
            {proposals.length ? (
              <ul className="process-list">
                {proposals
                  .sort((a: Proposal, b: Proposal) => {
                    return a.ballot_ratification ? -1 : 1;
                  })
                  .map((proposal: Proposal) => (
                    <div key={proposal.id} className="proposal">
                      <label>{proposal.title}</label>
                      {!proposal.ballot_ratification ? (
                        <button className="delete-proposal" onClick={() => deleteProposal(proposal.id, election)}>
                          delete
                        </button>
                      ) : null}
                    </div>
                  ))}
                </ul>
              ) : null}
              {addingProposal ? (
                <div className="event-section">
                  <form className="event-section_form" onSubmit={(e) => addProposal(e, election)}>
                    <input
                      type="text"
                      id="stage_title"
                      className="event-section_form_input"
                      placeholder="New Proposal"
                      value={newProposal}
                      onChange={(e) => setNewProposal(e.target.value)}
                    />
                    <button
                      type="submit"
                      >
                      Add
                    </button>
                  </form>
                </div>
              ) : (
                <button className="add-proposal" onClick={() => setAddingProposal(true)}>
                  <p>+ Add a proposal</p>
                </button>
              )}
              </>
            ) : (
              <p>This election has ended, so editing the ballot is disabled.</p>
            )}
        </div>
      ) : (
        <h3>Sorry! Something went wrong. Return home to find what you are looking for.</h3>
      )
    ) : (
      <h3>Loading...</h3>
    )}
      </>
  );
}

export default EventManager;
