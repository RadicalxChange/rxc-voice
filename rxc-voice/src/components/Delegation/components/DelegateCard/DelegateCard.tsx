import React from "react";
import moment from "moment";
import ProfileIcon from "../ProfileIcon";
import { VerificationMethod } from "../../../../models/VerificationMethod";

import "./DelegateCard.scss";

function DelegateCard(props: any) {
  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null
  const delegationOngoing = moment() < moment(props.process.conversation.start_date);
  const oauthDomain: string =
    (props.delegate.oauth_provider === VerificationMethod.Github)
    ? "https://github.com/" : "https://twitter.com/";

  return (
    <li className="delegate-card" key={props.delegate.id} >
      {props.delegate.profile_pic ? (
        <img src={props.delegate.profile_pic} className="profile-pic" alt="profile-pic" />
      ) : (
        <ProfileIcon />
      )}
      <div className="info">
        <h3 className="info-name">{props.delegate.user.first_name + " " + props.delegate.user.last_name}</h3>
        <a
          className="info-text"
          href={oauthDomain + props.delegate.public_username}
          target="_blank"
          rel="noopener nofollow noreferrer"
        >{props.delegate.public_username}
        </a>
        <h3 className="info-text">Current Voice Credits: {props.delegate.credit_balance}</h3>
        <h3 className="info-text">Received via transfer: {props.delegate.pending_credits}</h3>
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
