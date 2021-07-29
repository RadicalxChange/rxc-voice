import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { uuid } from "uuidv4";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { VerificationMethod } from "../../models/VerificationMethod";
import { WebService } from "../../services";
import { getDelegateId, getUserId, userobj, validateEmail } from "../../utils";
import ProfileIcon from "../Delegation/components/ProfileIcon";

import "./Account.scss";

function Account() {
  const github_client_id = 'f9be73dc7af4857809e0';
  const { setColor, logoutUser, updateCreditBalance, setUserData } = useContext(ActionContext);
  const { creditBalance } = useContext(StateContext);
  const [user, setUser] = useState(userobj());
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | undefined>(undefined);

  const alert = useAlert()

  useEffect(() => {
    setColor(BgColor.Yellow);

    var user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null
    console.log(user)
    setUser(user);
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
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

  const modify = (e: any) => {
    e.preventDefault()
    if (formIsComplete()) {
      if (validateEmail(email)) {
        // if (verificationMethod) {
          const updatedUser = {
            username: email,
            email: email,
            first_name: firstName,
            last_name: lastName,
          }
          WebService.modifyUser(updatedUser, getUserId(user))
            .subscribe(async (data) => {
              if (data.ok) {
                setEditMode(false);
                user.username = updatedUser.username;
                user.email = updatedUser.email;
                user.first_name = updatedUser.first_name;
                user.last_name = updatedUser.last_name;
                setUserData(user);
                // WebService.modifyDelegate({
                //   oauth_provider: verificationMethod,
                // }, getDelegateId(user))
                //   .subscribe(async (data) => {
                //     if (data.ok) {
                      // redirect to 3rd party oauth app
                      // if (verificationMethod === VerificationMethod.Github) {
                      //   const stateUUID = uuid();
                      //   sessionStorage.setItem("oauthState", stateUUID);
                      //   window.location.href =
                      //     'https://github.com/login/oauth/authorize?client_id='
                      //     + github_client_id
                      //     + '&redirect_uri=https://voice.radicalxchange.org/oauth2/callback&state='
                      //     + stateUUID;
                      // } else if (verificationMethod === VerificationMethod.Twitter) {
                      //   WebService.getTwitterRequestToken()
                      //     .subscribe(async (data) => {
                      //         sessionStorage.setItem("oauthState", data.oauth_token);
                      //         sessionStorage.setItem("twitterOauthSecret", data.oauth_secret);
                      //         window.location.href =
                      //           'https://api.twitter.com/oauth/authenticate?oauth_token='
                      //           + data.oauth_token;
                      //       }
                      //     );
                      // }
                //   } else {
                //     console.error("Error", await data.json());
                //   }
                // });
            } else {
              console.error("Error", await data.json());
            }
          });
        // } else {
        //   alert.error("Please select a verification method")
        // }
      } else {
        alert.error("Please enter a valid email address")
      }
    } else {
      alert.error("Please fill all the fields")
    }
  };

  const formIsComplete = () => {
    if (firstName && lastName && email) {
      return true;
    }
    return false;
  };

  const cancelEdit = () => {
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEditMode(false);
  };

  return (
    <div className="account">
      <h1 className="title">Account</h1>
      {user ? (
        <div className="delegate-card" key={user.id} >
          <>{user.profile_pic ? (
            <img src={user.profile_pic} className="profile-pic" alt="profile-pic" />
          ) : (
            <ProfileIcon />
          )}
          {editMode ? (
            <form className="edit-account" onSubmit={modify}>
              <input
                type="text"
                placeholder="First Name"
                className="login-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Last Name"
                className="login-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="buttons">
                <button
                  type="button"
                  className="account-button"
                  onClick={() => cancelEdit()}
                  >
                  cancel
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  >
                  save changes
                </button>
              </div>

            </form>
          ) : (
          <div className="info">
            <h3 className="name">{firstName + " " + lastName}</h3>
            <h3 className="email">{email}</h3>
            <h3 className="credit-balance">Credit Balance: {creditBalance}</h3>
          </div>
        )}</>
        </div>
      ) : (
        <h2>User not logged in.</h2>
      )}
      <div className="option-buttons">
        <button
          type="button"
          className="account-button"
          onClick={() => logoutUser()}
          >
          log out
        </button>
        {editMode ? (
          <>
          </>
        ) : (
          <button
            type="button"
            className="account-button"
            onClick={() => setEditMode(true)}
            >
            edit account
          </button>
        )}
      </div>
    </div>
  );
}

export default Account;
