import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useLocation } from "react-router";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";
import { Domain, getUserData, validateEmail } from "../../utils";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";
import { User } from "../../models/User";
import { Link } from "react-router-dom";
// import { containsLowerCase, containsNumber, containsSpecialCharacters, containsUpperCase, validatePasswordLength } from "../../utils";

import "./ValidationPage.scss";

function ValidationPage() {
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
          if (signedAgreement) {
            const updatedUser = {
              username: email,
              email: email,
              password: password,
              first_name: firstName,
              last_name: lastName,
            }
            const updatedProfile = {
              user: updatedUser,
            }
            if (user) {
              WebService.modifyUser(updatedUser, user.user_id)
                .subscribe(async (data) => {
                  console.error("Error", await data.json());
                });
              } else {
                WebService.createProfile(updatedProfile)
                  .subscribe(async (data) => {
                    if (data.ok) {
                      const userData = await data.json();
                      setUserData(userData);
                    } else {
                      const error = await data.json();
                      console.error("Error", error);
                      if (error.user.username) {
                        setAlreadyExists(true);
                      }
                    }
                  });
              }
              window.location.href = Domain.WEB;
          } else {
            alert.error("Please sign the user agreement")
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
    if (email && password && passReEntry) {
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

        <p className="oauth-message"><strong>Note:</strong> The first and last name fields are not required. You may choose to leave them blank, or use a Discord username or pseudonym. However, note that you will not be able to receive voice credit transfers from other users if they cannot identify you by a recognizable name, username, or pseudonym.</p>

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
