import React from "react";
import moment from "moment";
import ProfileIcon from "../ProfileIcon";
import { VerificationMethod } from "../../../../../../models/VerificationMethod";

import "./DelegateCard.scss";

function DelegateCard(props: any) {
  const delegationOngoing = moment() > moment(props.delegation.start_date) && moment() < moment(props.delegation.end_date);
  const oauthDomain: string =
    (props.delegate.profile.oauth_provider === VerificationMethod.Github)
    ? "https://github.com/" : "https://twitter.com/";

  return (
    <li className="delegate-card" key={props.delegate.id} >
      <ProfileIcon />
      <div className="info">
        {(props.delegate.profile.user.first_name || props.delegate.profile.user.last_name) ? (
          <h3 className="info-name">{props.delegate.profile.user.first_name + " " + props.delegate.profile.user.last_name}</h3>
        ) : (
          <h3 className="info-name">Anonymous</h3>
        )}
        {moment() > moment(props.delegation.end_date) || (props.delegate.id === props.userDelegate.id)  ? (
          <h3 className="info-text">Current Voice Credits: {props.delegate.credit_balance}</h3>
        ) : null}
        {props.delegation.allow_transfers && (moment() < moment(props.delegation.end_date)) ? (
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
