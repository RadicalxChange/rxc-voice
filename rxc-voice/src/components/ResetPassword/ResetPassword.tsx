import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Link, useLocation } from "react-router-dom";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";
// import { containsLowerCase, containsNumber, containsSpecialCharacters, containsUpperCase, validatePasswordLength } from "../../utils";

import "./ResetPassword.scss";

function ResetPassword() {
  const location = useLocation();
  const linkUid = new URLSearchParams(location.search).get('uidb64');
  const linkToken = new URLSearchParams(location.search).get('token');
  const { setColor } = useContext(ActionContext);
  const [password, setPassword] = useState("");
  const [passReEntry, setPassReEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const alert = useAlert()

  useEffect(() => {
    setColor(BgColor.White);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitPassword = (e: any) => {
    console.log("yo")
    e.preventDefault()
    if (password && passReEntry) {
      if (password === passReEntry) {
        // if (validatePasswordLength(password)) {
        //   if (containsSpecialCharacters(password)) {
        //     if (containsUpperCase(password)) {
        //       if (containsLowerCase(password)) {
        //         if (containsNumber(password)) {
                  WebService.resetPassword({
                    uidb64: linkUid,
                    token: linkToken,
                    password: password,
                  }).subscribe(async (data) => {
                    if (data.ok) {
                      setSubmitted(true);
                      setColor(BgColor.Yellow);
                    } else {
                      alert.error("Could not reset password. This link may be expired.");
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
        alert.error("Re-entered password does not match");
      }
    } else {
      alert.error("Please fill all the fields");
    }
  };

  return (
    <div className="reset-password">
      {submitted ? (
        <>
          <h2 className="header">Password Reset Complete</h2>
          <p className="text">Your new password has been set. Click the link below to login.</p>
          <Link
            to={`/`}
            className="login-link"
          >
            Log in
          </Link>
        </>
      ) : (
        <form className="form" onSubmit={submitPassword}>
          <h2 className="header">Reset Password</h2>

          <input
            type="password"
            placeholder="Password"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Re-Enter Password"
            className="password-input"
            value={passReEntry}
            onChange={(e) => setPassReEntry(e.target.value)}
          />

          <button
            type="submit"
            className="submit-button"
            >
            submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
