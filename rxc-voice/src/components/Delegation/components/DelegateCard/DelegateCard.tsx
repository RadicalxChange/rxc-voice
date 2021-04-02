import React from "react";
import moment from "moment";
import ProfileIcon from "../ProfileIcon";

import "./DelegateCard.scss";

function DelegateCard(props: any) {
  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null
  const delegationOngoing = moment() < moment(props.process.conversation.start_date);

  return (
    <li className="delegate-card" key={props.delegate.id} >
      {props.delegate.profile_pic ? (
        <img src={props.delegate.profile_pic} className="profile-pic" alt="profile-pic" />
      ) : (
        <ProfileIcon />
      )}
      <div className="info">
        <h3 className="name">{props.delegate.user.first_name + " " + props.delegate.user.last_name}</h3>
        <h3 className="username">{props.delegate.public_username}</h3>
        <h3 className="credit-balance">Credit Balance: {props.delegate.credit_balance}</h3>
      </div>
      {(delegationOngoing && (props.delegate.public_username !== (user ? user.public_username : null))) ? (
        <button
          type="button"
          className="give-credits"
          onClick={() => props.stageTransfer(props.delegate.public_username)}
        >
          give credits
        </button>
      ) : (
        <></>
      )}
    </li>
  );
}

export default DelegateCard;
