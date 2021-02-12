import React from "react";

import "./TransferCard.scss";

function TransferCard(props: any) {
  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null

  return (
    <li className="transfer-card" key={props.transfer.id} >
      <h3 className="sender">
        {props.transfer.user_is_sender ? (
          user.first_name + " " + user.last_name
        ) : (
          "Anonymous"
        )}
      </h3>
      <h3 className="recipient">
        {!props.transfer.user_is_sender ? (
          user.first_name + " " + user.last_name
        ) : (
          "Anonymous"
        )}
      </h3>
      <h3 className="amount">{props.transfer.user_is_sender ? "- " : "+ "}{props.transfer.amount} voice credits</h3>
    </li>
  );
}

export default TransferCard;
