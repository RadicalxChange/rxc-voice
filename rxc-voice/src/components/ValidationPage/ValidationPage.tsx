import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useLocation } from "react-router";
import { uuid } from "uuidv4";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { VerificationMethod } from "../../models/VerificationMethod";
import { WebService } from "../../services";
import { getDelegateId, getUserId, validateEmail } from "../../utils";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";
// import { containsLowerCase, containsNumber, containsSpecialCharacters, containsUpperCase, validatePasswordLength } from "../../utils";

import "./ValidationPage.scss";

function ValidationPage() {
    const github_client_id = 'f9be73dc7af4857809e0';
    const location = useLocation();
    const linkUid = new URLSearchParams(location.search).get('uidb64');
    const linkToken = new URLSearchParams(location.search).get('token');
    const { setUserData, setColor } = useContext(ActionContext);
    const { user } = useContext(StateContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passReEntry, setPassReEntry] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [profilePic, setProfilePic] = useState("");
    const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | undefined>(undefined);
    const [sentEmail, setSentEmail] = useState(false);
    const [signedAgreement, setSignedAgreement] = useState(false);
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
            const user = await data.json();
            setUserData(user);
            setLoading(false);
          } else {
            const error = await data.json();
            console.log(error);
            alert.error(error.non_field_errors[0]);
            setLoading(false);
          }
        });
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const modify = (e: any) => {
      e.preventDefault()
      if (formIsComplete()) {
        if (validateEmail(email)) {
          if (password === passReEntry) {
            if (verificationMethod) {
              if (signedAgreement) {
                // if (validatePasswordLength(password)) {
                //   if (containsSpecialCharacters(password)) {
                //     if (containsUpperCase(password)) {
                //       if (containsLowerCase(password)) {
                //         if (containsNumber(password)) {
                      const updatedUser = {
                        username: email,
                        email: email,
                        password: password,
                        first_name: firstName,
                        last_name: lastName,
                      }
                      WebService.modifyUser(updatedUser, getUserId(user))
                        .subscribe(async (data) => {
                          if (data.ok) {
                            WebService.modifyDelegate({
                              oauth_provider: verificationMethod,
                            }, getDelegateId(user))
                              .subscribe(async (data) => {
                                if (data.ok) {
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
                                    WebService.getTwitterRequestToken()
                                      .subscribe(async (data) => {
                                          sessionStorage.setItem("oauthState", data.oauth_token);
                                          sessionStorage.setItem("twitterOauthSecret", data.oauth_secret);
                                          window.location.href =
                                            'https://api.twitter.com/oauth/authenticate?oauth_token='
                                            + data.oauth_token;
                                        }
                                      );
                                  } else if (verificationMethod === VerificationMethod.Application) {
                                    WebService.emailApplication()
                                      .subscribe(async (data) => {
                                        if (data.ok) {
                                          setSentEmail(true);
                                        } else {
                                          console.error("Error", await data.json());
                                        }
                                      });
                                  }
                                } else {
                                  console.error("Error", await data.json());
                                }
                              });
                          } else {
                            console.error("Error", await data.json());
                          }
                        });
                //         } else {
                //           alert.error("Password must contain at least one number")
                //         }
                //       } else {
                //         alert.error("Password must contain at least one lower case character")
                //       }
                //     } else {
                //       alert.error("Password must contain at least one upper case character")
                //     }
                //   } else {
                //     alert.error("Password must contain at least 1 special character")
                //   }
                // } else {
                //   alert.error("Password length must be at least 8 characters")
                // }
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
  } else if (!user) {
    return (
      <h2>Sorry! This activation link is invalid or expired.</h2>
    );
  } else if (sentEmail) {
    return (
      <div className="email-notice">
        <h2>Apply to verify your account</h2>
        <p className="text">Follow the instructions in the email we just sent
        you to apply to verify your account. If your application is
        approved, you will receive a confirmation email. You will not be able
        to log in to your account until{" "}<strong>after</strong> you have received
        a confirmation email.
        </p>
      </div>
    );
  } else {
    return (
      <form className="create-account" onSubmit={modify}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Create your account to participate in the democratic process!</p>

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

        <p className="oauth-message">Login to either a Github or Twitter account to verify your identity. We will not access any information on your third-party account other than your username. You may also opt to apply to be verified in a quick video call.</p>
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
              case VerificationMethod.Application: {
                return VerificationMethod.Application;
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
          <option value={VerificationMethod.Application}>Verify by Video Application</option>
        </select>

        <div className="attestation">
          <h3>User Agreement</h3>
          <p>I attest that I will be the sole owner of the RxC Voice account that I am about to create.</p>
          <p>I will not attempt to create or control, either directly or by proxy, any other account on RxC Voice.</p>
          <label>I agree</label>
          <input type="checkbox" defaultChecked={signedAgreement} onChange={() => setSignedAgreement(!signedAgreement)} />
        </div>

        <button
          type="submit"
          className="create-account-button"
          >
          create account
        </button>
      </form>
    );
  }
}

export default ValidationPage;
