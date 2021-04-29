import React, { useState } from "react";
import ProposalBlocks from "./ProposalBlocks";
import { useAlert } from 'react-alert'

import "./ProposalWidget.scss";

function ProposalWidget(props: any) {
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);

  const alert = useAlert()

  // TODO: change type to ENUM
  const handleChange = (change: number) => {
    const newAmount: number = amount + change;
    if (newAmount < 0 && props.negativeVotes === false) {
      console.log("negative votes disabled.")
    } else {
      const newCost: number = newAmount * newAmount;
      if (newCost - cost > props.creditsRemaining) {
        alert.error("you don't have enough voice credits")
      } else {
        props.onChange({ proposal: props.proposal.id,
                         amount: change,
                         cost: newCost - cost, });
        setAmount(amount => newAmount);
        setCost(cost => newCost);
      }
    }
  };


  return (
    <li
      id={`${props.proposal.ballot_ratification ? "ratification-proposal" : ""}`}
      className="proposal-widget">
      <h3 className="proposal-info">{props.proposal.title}</h3>
      <span className="proposal-info">{props.proposal.description}</span>
      <a
        className="proposal-link"
        href={props.proposal.link}
      >{props.proposal.link}
      </a>
      <div className="widget">
        <div className="blocks-container">
          <ProposalBlocks cost={cost} />
        </div>
        {(cost !== 0) ? (
          <><h3 className="voice-credits">voice credits</h3>
            <h3 className="equals">=</h3></>
        ) : null}
        <div className="counter-container">
          <button
            type="button"
            className="arrow"
            onClick={() => handleChange(1)}
            >
              <svg className="svg" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="path" d="M13 8L7 2L1 8" stroke="black" strokeWidth="1.5"/>
              </svg>
          </button>
          <h3 className="vote-counter">{amount} votes</h3>
          <button
            type="button"
            className="arrow"
            onClick={() => handleChange(-1)}
            >
              <svg className="svg" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="path" d="M1 1L7 7L13 1" stroke="black" strokeWidth="1.5"/>
              </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

export default ProposalWidget;
