import React, { useContext } from "react";
import { Link } from "react-router-dom";
import defaultPic from '../../../../../../assets/icons/profile_icon.svg';
import { ActionContext } from "../../../../../../hooks";

import "./DelegateCard.scss";

function DelegateCard(props: any) {
  const { stageTransfer } = useContext(ActionContext);

  return (
    <li className="delegate-card" key={props.delegate.id} >
      {props.delegate.profile_pic ? (
        <img src={props.delegate.profile_pic} className="profile-pic" alt="profile-pic" />
      ) : (
        <img src={defaultPic} className="profile-pic" alt="profile-pic" />
      )}
      <div className="info">
        <h3 className="name">{props.delegate.user.first_name + " " + props.delegate.user.last_name}</h3>
        <h3 className="username">{props.delegate.public_username}</h3>
        <h3 className="credit-balance">Credit Balance: {props.delegate.credit_balance}</h3>
      </div>
      <Link
      to={`/${props.process.id}/give-credits`}
      className="give-credits"
      onClick={(e) => stageTransfer({
        sender: sessionStorage.getItem("user") ? (JSON.parse(sessionStorage.getItem("user")!).id) : (null),
        recipient: props.delegate,
        process: props.process.id,
      })}
      >
      give credits
      </Link>
    </li>
  );
}

export default DelegateCard;
