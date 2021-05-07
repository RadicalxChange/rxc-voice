import React from "react";
import ProposalBlocks from "./ProposalBlocks";
import { useAlert } from 'react-alert'

import "./ProposalWidget.scss";

function ProposalWidget(props: any) {

  const alert = useAlert()

  // TODO: change type to ENUM
  const handleChange = (amountChange: number) => {
    const newAmount: number = props.proposal.amount + amountChange;
    if (newAmount < 0 && props.negativeVotes === false) {
      console.log("negative votes disabled.")
    } else {
      const newCost: number = newAmount * newAmount;
      const costChange: number = newCost - Math.pow(props.proposal.amount, 2);
      if (costChange > props.creditsRemaining) {
        alert.error("you don't have enough voice credits")
      } else {
        props.onChange({
          id: props.proposal.id,
          amount: amountChange,
          cost: costChange
        });
      }
    }
  };

  return (
    <li
      id={`${props.proposal.ballot_ratification ? "ratification-proposal" : ""}`}
      className="proposal-widget">
      <label className="proposal-info">{props.proposal.title}</label>
      <div className="widget">
        <div className="blocks-container">
          <ProposalBlocks cost={Math.pow(props.proposal.amount, 2)} />
        </div>
        {(Math.pow(props.proposal.amount, 2) !== 0) ? (
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
          <h3 className="vote-counter">{props.proposal.amount} votes</h3>
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
