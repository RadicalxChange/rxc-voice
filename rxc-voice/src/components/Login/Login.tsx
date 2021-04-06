import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";
import { useAlert } from 'react-alert'
import { Link } from "react-router-dom";
import { userIsVerified } from "../../utils";
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
      <div className="login">
        <h2>Unverified account</h2>
        <p>Sorry, but you can't access the site until you verify your account.</p>
        <p>You can do that by clicking the link in your invitation email, creating an account, and logging into a valid Github or Twitter account to verify.</p>
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
