import React, { useState } from "react";
import { Voter } from "../../../../models/Voter";

function VoterList(props: any) {
  const [voterList, setVoterList] = useState(new Array<Voter>());
  const [editableVoter, setEditableVoter] = useState("");
  const [nextId, setNextId] = useState(0);


   let handleDelete = (id: number) => {
     // console.log("deleted:")
     // console.log(id);
     const newVoterList: Voter[] = voterList.filter(voter => voter.id !== id);
     setVoterList(voterList => newVoterList);
     props.onChange(newVoterList);
     // console.log("changed voter list to:");
     // console.log(newVoterList);
   };

   let handleAdd = (newEmail: string) => {
     const newVoter: Voter = { id: nextId, email: newEmail }
     const newVoterList: Voter[] = [...voterList, newVoter];
     setVoterList(voterList => newVoterList);
     setNextId(nextId => nextId + 1);
     setEditableVoter("");
     props.onChange(newVoterList);
   };

  return (
    <div className="voterList-container">
      <ul>
        {voterList.map(voter => (
          <li className="voter" key={voter.id}>
            <label>{voter.email}</label>
            <button
              type="button"
              onClick={() => handleDelete(voter.id)}>
              remove
            </button>
          </li>
        ))}
      </ul>
      <div className="add-voter">
        <input
          type="text"
          placeholder="Enter email address"
          value={editableVoter}
          onChange={(e) => setEditableVoter(e.target.value)}
        />
        <button
          type="button"
          onClick={() => handleAdd(editableVoter)}>
          add
        </button>
      </div>
    </div>
  );
}

export default VoterList;
