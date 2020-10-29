import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import moment from 'moment';
import "./ElectionCreator.scss";
import blackSquareIcon from '../../assets/black-square.png';

function ElectionCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ballot, setBallot] = useState([]);
  // setBallot(ballot => [...ballot, e.target.value])
  const [voters, setVoters] = useState([]);
  // setVoters(voters => [...voters, e.target.value])
  const [voteToken, setVoteToken] = useState({blackSquareIcon});
  const [numTokens, setNumTokens] = useState(99);
  const [negativeVotes, setNegativeVotes] = useState(true)
  const [startTime, setStartTime] = useState(moment().format('LLL'));
  const [endTime, setEndTime] = useState(moment().add(1, "days").format('LLL'));

  const createElection = () => {
    console.log("submitted");
  //   if (formComplete()) {
  //     WebService.postElection({
  //       title: title,
  //       description: description,
  //       start_date: startTime,
  //       end_date: endTime,
  //       negative_votes:
  //     })
  //   } else {
  //   showAlert("Please fill all the fields");
  // }
  };

  const formComplete = () => {
    return title && ballot.length && voters.length
  };

  return (
    <div className="election-creator">
        <h2>Create a New Election</h2>
        <p>Customize the election settings and populate the ballot.
        QVtool will automatically send invitations to the voters via
        email addresses you provide.</p>

        <label>
          Election Title
          <input
            type="text"
            placeholder="Enter Election Title"
            className="basic-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Description
          <input
            type="text"
            placeholder="Enter Description (Optional)"
            className="basic-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Ballot
        </label>

        <label>
          Voters
        </label>

        <label>
          Vote Token
        </label>

        <label>
          Vote Tokens per Voter
          <input
            type="number"
            min="1"
            max="999"
            step="1"
            value={numTokens}
            onChange={(e) => setNumTokens(Number(e.target.value))}
          />
        </label>

        <label>
          Allow Negative Votes
          <Switch
            checked={negativeVotes}
            onChange={() => setNegativeVotes(!negativeVotes)}
          />
        </label>

        <label>
          Start Time
          <input
            type="datetime-local"
            className="datetime-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <label>
          End Time
          <input
            type="datetime-local"
            className="datetime-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="create-election-button"
          onClick={createElection}
          >
          submit
        </button>



    </div>
  );
}

export default ElectionCreator;
