import React from "react";
import Blocks from "./Blocks";

import "./RemainingCredits.scss";

function RemainingCredits(props: any) {

  return (
    <div className="container">
      <h3 className="header">Available Voice Credits</h3>
      <Blocks
        creditsRemaining={props.creditsRemaining}
        creditBalance={props.creditBalance}
      />
      <p className="credits-remaining">
        {props.creditsRemaining}/{props.creditBalance} voice credits remaining
      </p>
    </div>
  );
}

export default RemainingCredits;
