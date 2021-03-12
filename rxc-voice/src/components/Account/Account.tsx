import React, { useContext, useEffect, useState } from "react";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import defaultPic from '../../assets/icons/profile_icon.svg';

import "./Account.scss";
import { WebService } from "../../services";

function Account() {
  const { setColor, logoutUser, updateCreditBalance } = useContext(ActionContext);
  const { creditBalance } = useContext(StateContext);
  const [user, setUser] = useState(WebService.userobj);

  useEffect(() => {
    setColor(BgColor.Yellow);

    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null
    setUser(user);
    if (creditBalance === null) {
      if (user) {
        WebService.getDelegate(user.id).subscribe(async (data: any) => {
          if (data.ok) {
            const delegate = await data.json();
            updateCreditBalance(delegate.credit_balance);
          }
        });
      }
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="account">
      <h1 className="title">Account</h1>
      {user ? (
        <div className="delegate-card" key={user.id} >
          {user.profile_pic ? (
            <img src={user.profile_pic} className="profile-pic" alt="profile-pic" />
          ) : (
            <img src={defaultPic} className="profile-pic" alt="profile-pic" />
          )}
          <div className="info">
            <h3 className="name">{user.first_name + " " + user.last_name}</h3>
            <h3 className="email">{user.email}</h3>
            <h3 className="credit-balance">Credit Balance: {creditBalance}</h3>
          </div>
        </div>
      ) : (
        <h2>User not logged in.</h2>
      )}
      <button
        type="button"
        className="logout-button"
        onClick={() => logoutUser()}
        >
        log out
      </button>
    </div>
  );
}

export default Account;
