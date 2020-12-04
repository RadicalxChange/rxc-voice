import React, { useState } from "react";
// import { Proposal } from "../../../../models/Proposal";
import "./ProposalWidget.scss";

function ProposalWidget(props: any) {
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);

  // TODO: change type to ENUM
  const handleChange = (change: number) => {
    const newAmount: number = amount + change;
    if (newAmount < 0 && props.negativeVotes === false) {
      console.log("negative votes disabled.")
    } else {
      const newCost: number = (amount + change) * (amount + change);
      if (cost > props.tokensRemaining) {
        console.log("not enough tokens.")
      } else {
        props.onChange({ proposal: props.proposal.id,
                         amount: change,
                         cost: newCost - cost, });
        setAmount(amount => newAmount);
        setCost(cost => newCost);
      }
    }
  }


  return (
    <div className="proposal-widget">
      <label>{props.proposal.title}
        <button
          type="button"
          className="vote-counter"
          onClick={() => handleChange(-1)}>
          -
        </button>
        <h3 className="vote-counter">{amount}</h3>
        <button
          type="button"
          className="vote-counter"
          onClick={() => handleChange(1)}>
          +
        </button>
      </label>
    </div>
  );
}

export default ProposalWidget;
