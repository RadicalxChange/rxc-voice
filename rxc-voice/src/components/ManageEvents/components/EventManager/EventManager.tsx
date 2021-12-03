import React, { useContext, useEffect, useState } from "react";
import { ActionContext, StateContext } from "../../../../hooks/AppProvider";
import { Stage } from "../../../../models/Stage";
import { BgColor } from "../../../../models/BgColor";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import { useParams } from "react-router";

import "./EventManager.scss";
import { WebService } from "../../../../services";
import { Proposal } from "../../../../models/Proposal";

export interface Change {
  id: number,
  field: string,
  value: any,
}

function EventManager() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { setColor, selectProcess } = useContext(ActionContext);
  const { selectedProcess } = useContext(StateContext);
  const [newProposal, setNewProposal] = useState("");
  const [proposals, setProposals] = useState(new Array<Proposal>())
  const [addingProposal, setAddingProposal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setColor(BgColor.White);
    if (selectedProcess?.id !== +processId) {
      selectProcess(processId);
    } else if (selectedProcess) {
      const election = selectedProcess.stages.map((stage: Stage): any => {
        return stage;
      })[2]
      WebService.fetchProposals(election.id)
      .subscribe((data: any) => {
        setProposals(data.proposals);
      });
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, selectedProcess]);

  const addProposal = (e: any) => {
    e.preventDefault();
    if (selectedProcess && newProposal) {
      const election = selectedProcess.stages.map((stage: Stage): any => {
        return stage;
      })[2]
      const proposalData = {
        title: newProposal,
        ballot_ratification: false,
        election: election.id,
        credits_received: 0,
        votes_received: 0,
      }
      WebService.postProposal(election.id, proposalData).subscribe(async (data) => {
        if (data.ok) {
          setNewProposal("");
          setAddingProposal(false);
          WebService.fetchProposals(election.id)
          .subscribe((data: any) => {
            setProposals(data.proposals);
          });
        } else {
          const error = await data.json();
          Object.keys(error).forEach((key) => {
            console.log(error[key]);
          });
        }
      });
    }
  };

  const deleteProposal = (proposal_id: number) => {
    if (selectedProcess) {
      const election = selectedProcess.stages.map((stage: Stage): any => {
        return stage;
      })[2]
      WebService.deleteProposal(proposal_id).subscribe(async (data) => {
        if (data.ok) {
          setNewProposal("");
          setAddingProposal(false);
          WebService.fetchProposals(election.id)
          .subscribe((data: any) => {
            setProposals(data.proposals);
          });
        } else {
          const error = await data.json();
          Object.keys(error).forEach((key) => {
            console.log(error[key]);
          });
        }
      });
    }
  };

  return (
    <>
    {!loading ? (
      selectedProcess ? (
        <div className="create-event">
          <div className="create-event_header">
            <h1>Event Manager</h1>
            <p>{selectedProcess.title}</p>
          </div>
          <h2>Election</h2>
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
                      <button className="delete-proposal" onClick={() => deleteProposal(proposal.id)}>
                        delete
                      </button>
                    ) : null}
                  </div>
                ))}
              </ul>
            ) : null}
            {addingProposal ? (
              <div className="event-section">
                <form className="event-section_form" onSubmit={addProposal}>
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
