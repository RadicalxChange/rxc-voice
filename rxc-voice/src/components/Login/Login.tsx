import React, { useContext, useEffect, useState } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";

import "./Login.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setColor, setUserData } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.White)

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () => {
    if (email && password) {
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
        }
      });
    }
  };

  return (
    <div className="login">
      <label className="app-title">RxC Voice</label>
      <input
        type="text"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        className="login-button"
        onClick={() => login()}
        >
        sign in
      </button>
    </div>
  );
}

export default Login;
