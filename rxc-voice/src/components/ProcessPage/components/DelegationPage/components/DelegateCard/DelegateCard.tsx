import React from "react";
import moment from "moment";
import ProfileIcon from "../ProfileIcon";
import { VerificationMethod } from "../../../../../../models/VerificationMethod";

import "./DelegateCard.scss";

function DelegateCard(props: any) {
  const delegationOngoing = moment() < moment(props.delegation.end_date) && moment(props.delegation.start_date) < moment();
  const oauthDomain: string =
    (props.delegate.profile.oauth_provider === VerificationMethod.Github)
    ? "https://github.com/" : "https://twitter.com/";

  return (
    <li className="delegate-card" key={props.delegate.id} >
      <ProfileIcon />
      <div className="info">
        <h3 className="info-name">{props.delegate.profile.user.first_name + " " + props.delegate.profile.user.last_name}</h3>
        <a
          className="info-text"
          href={oauthDomain + props.delegate.profile.public_username}
          target="_blank"
          rel="noopener nofollow noreferrer"
        >{props.delegate.profile.public_username}
        </a>
        {!delegationOngoing || (props.delegate.id === props.userDelegate.id)  ? (
          <h3 className="info-text">Current Voice Credits: {props.delegate.credit_balance}</h3>
        ) : null}
        {props.delegation.allow_transfers ? (
          <h3 className="info-text">Credits Received via Transfer: {props.delegate.pending_credits}</h3>
        ) : null}
      </div>
      {(delegationOngoing && props.delegation.allow_transfers && (props.delegate.id !== props.userDelegate.id)) ? (
        <button
          type="button"
          className="give-credits"
          onClick={() => props.stageTransfer(props.delegate)}
        >
          give credits
        </button>
      ) : null}
    </li>
  );
}

export default DelegateCard;
