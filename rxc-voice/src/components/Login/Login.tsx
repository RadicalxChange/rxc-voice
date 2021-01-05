import React, { useContext, useEffect, useState } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";
import { useAlert } from 'react-alert'
// import logo from '../../assets/logo.svg';

import "./Login.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setColor, setUserData } = useContext(ActionContext);

  const alert = useAlert()

  useEffect(() => {
    setColor(BgColor.White)

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (e: any) => {
    e.preventDefault()
    if (email && password) {
      console.log({username: email, password: password});
      WebService.loginUser({
        username: email,
        password: password,
      }).subscribe(async (data) => {
        if (data.ok) {
          const user = await data.json();
          setUserData(user);
        } else {
          const error = await data.json();
          console.log(error);
          alert.error(error.non_field_errors[0]);
        }
      });
    }
  };

  return (
    <form className="login" onSubmit={login}>
      <label className="app-title">RxC Voice</label>
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
    </form>
  );
}

export default Login;
