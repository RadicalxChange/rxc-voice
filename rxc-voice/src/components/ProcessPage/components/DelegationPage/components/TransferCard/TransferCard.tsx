import React from "react";

import "./TransferCard.scss";

function TransferCard(props: any) {

  return (
    <li className="transfer-card" key={props.transfer.id} >
      <h3 className="sender">
        {props.transfer.user_is_sender ? (
          "Sent"
        ) : (
          "Received"
        )}
      </h3>
      <h3 className="amount">{props.transfer.user_is_sender ? "- " : "+ "}{props.transfer.amount} voice credits</h3>
    </li>
  );
}

export default TransferCard;
