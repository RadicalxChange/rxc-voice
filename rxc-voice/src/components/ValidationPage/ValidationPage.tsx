import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useLocation } from "react-router";
import { uuid } from "uuidv4";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { VerificationMethod } from "../../models/VerificationMethod";
import { WebService } from "../../services";
import { getUserData, validateEmail } from "../../utils";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";
import { User } from "../../models/User";
import { Link } from "react-router-dom";
// import { containsLowerCase, containsNumber, containsSpecialCharacters, containsUpperCase, validatePasswordLength } from "../../utils";

import "./ValidationPage.scss";

function ValidationPage() {
  const github_client_id = 'f9be73dc7af4857809e0';
  const location = useLocation();
  const linkUid = new URLSearchParams(location.search).get('uidb64');
  const linkToken = new URLSearchParams(location.search).get('token');
  const { setUserData, setColor } = useContext(ActionContext);
  const user: User | undefined = getUserData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passReEntry, setPassReEntry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [profilePic, setProfilePic] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | undefined>(undefined);
  const [signedAgreement, setSignedAgreement] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const alert = useAlert()

  useEffect(() => {
    setColor(BgColor.White);

    if (linkToken && linkUid) {
      WebService.validateToken({
        uidb64: linkUid,
        token: linkToken,
      }).subscribe(async (data) => {
        if (data.ok) {
          const userData = await data.json();
          setUserData(userData);
        } else {
          const error = await data.json();
          console.log(error);
          alert.error(error.non_field_errors[0]);
        }
      });
    }
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modify = (e: any) => {
    e.preventDefault()
    if (formIsComplete()) {
      if (validateEmail(email)) {
        if (password === passReEntry) {
          if (verificationMethod) {
            if (signedAgreement) {
              const updatedUser = {
                username: email,
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
              }
              if (user) {
                WebService.modifyUser(updatedUser, user.user_id)
                  .subscribe(async (data) => {
                    if (data.ok) {
                      WebService.modifyProfile({
                        oauth_provider: verificationMethod,
                      }, user.id)
                        .subscribe(async (data) => {
                          if (data.ok) {
                            oauthRedirect();
                          }
                        });
                    } else {
                      console.error("Error", await data.json());
                    }
                  });
                } else {
                  WebService.createProfile(updatedUser)
                    .subscribe(async (data) => {
                      if (data.ok) {
                        const userData = await data.json();
                        setUserData(userData);
                        oauthRedirect();
                      } else {
                        const error = await data.json();
                        console.error("Error", error);
                        if (error.user.username) {
                          setAlreadyExists(true);
                        }
                      }
                    });
                }
            } else {
              alert.error("Please sign the user agreement")
            }
          } else {
            alert.error("Please select a verification method")
          }
        } else {
          alert.error("Re-entered password does not match")
        }
      } else {
        alert.error("Please enter a valid email address")
      }
    } else {
      alert.error("Please fill all the fields")
    }
  };

  const oauthRedirect = () => {
    // redirect to 3rd party oauth app
    if (verificationMethod === VerificationMethod.Github) {
      const stateUUID = uuid();
      sessionStorage.setItem("oauthState", stateUUID);
      window.location.href =
        'https://github.com/login/oauth/authorize?client_id='
        + github_client_id
        + '&redirect_uri=https://voice.radicalxchange.org/oauth2/callback&state='
        + stateUUID;
    } else if (verificationMethod === VerificationMethod.Twitter) {
      WebService.getTwitterRequestToken().subscribe(async (data) => {
        sessionStorage.setItem("oauthState", data.oauth_token);
        sessionStorage.setItem("twitterOauthSecret", data.oauth_secret);
        window.location.href =
          'https://api.twitter.com/oauth/authenticate?oauth_token='
          + data.oauth_token;
        }
      );
    }
  };

  const formIsComplete = () => {
    if (firstName && lastName && email && password && passReEntry) {
      return true;
    }
    return false;
  };

  if (loading) {
    return (
      <h2>loading...</h2>
    );
  } else if (linkToken && linkUid && !user) {
    return (
      <>
      <h2>Sorry! This activation link is invalid or expired.</h2>
      <a className="home-button" href="/">Back to RxC Voice</a>
      </>
    );
  } else {
    return (
      <>
      <div className="login-header">
        <p>Already have an account?{" "}
        <Link
        to={`/login`}
        className="nav-link"
        >
        Sign in
        </Link>
        </p>
      </div>
      <form className="create-account" onSubmit={modify}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Create an account</p>

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

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Re-Enter Password"
          className="login-input"
          value={passReEntry}
          onChange={(e) => setPassReEntry(e.target.value)}
        />

        <p className="oauth-message">Login to either a Github or Twitter account to verify your identity. We will not access any information on your third-party account other than your username.</p>
        <select
          className="oauth-provider"
          id="select-oauth-provider"
          defaultValue=""
          onChange={(e) => setVerificationMethod(() => {
            switch (e.target.value) {
              case VerificationMethod.Github: {
                return VerificationMethod.Github;
              }
              case VerificationMethod.Twitter: {
                return VerificationMethod.Twitter;
              }
              default: {
                return undefined;
              }
            }
          })}
        >
          <option value="" disabled hidden>
            Select a verification method
          </option>
          <option value={VerificationMethod.Github}>Verify with Github</option>
          <option value={VerificationMethod.Twitter}>Verify with Twitter</option>
        </select>

        <div className="attestation">
          <h3>User Agreement</h3>
          <p>I attest that I will be the sole owner of the RxC Voice account that I am about to create.</p>
          <p>I will not attempt to create or control, either directly or by proxy, any other account on RxC Voice.</p>
          <label>I agree</label>
          <input type="checkbox" defaultChecked={signedAgreement} onChange={() => setSignedAgreement(!signedAgreement)} />
        </div>

        {alreadyExists ? (
          <p id="error-message">A profile already exists with that email address.{" "}
            <a className="login-link" href="/login">Go to Login</a>
          </p>
        ) : null}

        <button
          type="submit"
          className="create-account-button"
          >
          create account
        </button>
      </form>
      </>
    );
  }
}

export default ValidationPage;
