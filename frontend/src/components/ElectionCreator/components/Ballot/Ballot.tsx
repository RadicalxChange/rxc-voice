import React, { useState } from "react";
import { Proposal } from "../../../../models/Proposal";

function Ballot(props: any) {
  const [ballot, setBallot] = useState(new Array<Proposal>());
  const [editableProposal, setEditableProposal] = useState("");
  const [nextId, setNextId] = useState(0);


   let handleDelete = (id: number) => {
     // console.log("deleted:")
     // console.log(id);
     const newBallot: Proposal[] = ballot.filter(proposal => proposal.id !== id);
     setBallot(ballot => newBallot);
     props.onChange(newBallot);
     // console.log("changed ballot to:");
     // console.log(newBallot);
   };

   let handleAdd = (proposal: string) => {
     const newProposal: Proposal = { id: nextId, name: proposal }
     const newBallot: Proposal[] = [...ballot, newProposal];
     setBallot(ballot => newBallot);
     setNextId(nextId => nextId + 1);
     setEditableProposal("");
     props.onChange(newBallot);
   };

  return (
    <div className="ballot-container">
      <ul>
        {ballot.map(proposal => (
          <li className="ballot-proposal" key={proposal.id}>
            <label>{proposal.name}</label>
            <button
              type="button"
              onClick={() => handleDelete(proposal.id)}>
              remove
            </button>
          </li>
        ))}
      </ul>
      <div className="add-proposal">
        <input
          type="text"
          placeholder="Enter proposal"
          value={editableProposal}
          onChange={(e) => setEditableProposal(e.target.value)}
        />
        <button
          type="button"
          onClick={() => handleAdd(editableProposal)}>
          add
        </button>
      </div>
    </div>
  );
}

export default Ballot;
