import React, { useContext, useState } from "react";
import { useAlert } from "react-alert";
// import { uuid } from "uuidv4";
import { ActionContext } from "../../hooks";
import { User } from "../../models/User";
// import { VerificationMethod } from "../../models/VerificationMethod";
import { WebService } from "../../services";
import { getUserData, validateEmail } from "../../utils";
import ProfileIcon from "../ProcessPage/components/DelegationPage/components/ProfileIcon";

import "./Account.scss";

function Account() {
  // const github_client_id = 'f9be73dc7af4857809e0';
  const { logoutUser, setUserData } = useContext(ActionContext);
  const user: User | undefined = getUserData();
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState(user ? user.email : "");
  const [firstName, setFirstName] = useState(user ? user.first_name : "");
  const [lastName, setLastName] = useState(user ? user.last_name : "");
  // const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | undefined>(undefined);

  const alert = useAlert()

  const modify = (e: any, user: User) => {
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
          WebService.modifyUser(updatedUser, user.user_id)
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
    if (email) {
      return true;
    }
    return false;
  };

  const cancelEdit = () => {
    setEmail(user ? user.email : "");
    setFirstName(user ? user.first_name : "");
    setLastName(user ? user.last_name : "");
    setEditMode(false);
  };

  return (
    <div className="account">
      <h1 className="title">Account</h1>
      {user ? (
        <div className="delegate-card" key={user.id}>
          <ProfileIcon />
          {editMode ? (
            <form className="edit-account" onSubmit={(e) => modify(e, user)}>
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
            {firstName || lastName ? (
              <h3 className="name">{firstName + " " + lastName}</h3>
            ) : (
              <h3 className="name">Anonymous</h3>
            )}
            <h3 className="email">{email}</h3>
          </div>
        )}
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
