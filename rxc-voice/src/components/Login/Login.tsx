import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";
import { useAlert } from 'react-alert'
import { Link } from "react-router-dom";
import { Domain, userIsVerified } from "../../utils";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";

import "./Login.scss";

function Login() {
  const location = useLocation();
  const linkUid = new URLSearchParams(location.search).get('uidb64');
  const linkToken = new URLSearchParams(location.search).get('token');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unverifiedLogin, setUnverifiedLogin] = useState(false);
  const { setColor, setUserData } = useContext(ActionContext);

  const alert = useAlert()

  useEffect(() => {
    setColor(BgColor.White)

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (e: any) => {
    e.preventDefault()
    if (email && password) {
      WebService.loginUser({
        user: {
          username: email,
          password: password,
        },
        creds: {
          uidb64: linkUid,
          token: linkToken,
        },
      }).subscribe(async (data) => {
        if (data.ok) {
          const user = await data.json();
          setUserData(user);
          if (!userIsVerified(user)) {
            setUnverifiedLogin(true);
          }
          if (linkToken) {
            window.location.href = Domain.WEB;
          }
        } else {
          const error = await data.json();
          console.log(error);
          alert.error(error.non_field_errors[0]);
        }
      });
    }
  };

  if (unverifiedLogin) {
    return (
      <div className="login-unverified">
        <h2>Unverified account</h2>
        <p>Sorry, but you can't access the site until you verify your account.</p>
        <p>You are probably here because you selected "Video application" as your verification method when you created your account. If this is the case, you will not be able to log into the site until are verified by a site administrator.</p>
        <p>If you decide that you would rather verify your account by logging into a Github or Twitter account that you own, you can always click the link in your invitation email and choose either of those options instead.</p>
        <p>If you would like to be verified by video application, you must set up a 5 min video call with a member of the RadicalxChange team. Your camera must be on and your face must be visible so that we can visually identify you.</p>
        <p><strong>On the video call, you will attest that:</strong></p>
        <ul className="list">
          <li>
            <p>You are the sole owner of this RxC Voice account and the email address associated with it.</p>
          </li>
          <li>
            <p>You agree that you will not attempt to create or control, either directly or by proxy, any other account on RxC Voice.</p>
          </li>
        </ul>
        <p>Please note that RadicalxChange Foundation will not allow users to hold multiple accounts on RxC Voice.</p>
      </div>
    );
  }
  return (
    <form className="login" onSubmit={login}>
      <img src={logo} className="App-logo" alt="logo" />
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

      <button
        type="submit"
        className="login-button"
        >
        sign in
      </button>
      <Link
        to={`/forgot-password`}
        className="forgot-password"
      >
        Forgot password?
      </Link>
    </form>
  );
}

export default Login;
