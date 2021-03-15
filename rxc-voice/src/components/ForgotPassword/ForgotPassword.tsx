import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { WebService } from "../../services";

import "./ForgotPassword.scss";

function ForgotPassword() {
  const { setColor } = useContext(ActionContext);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const alert = useAlert()

  useEffect(() => {
    setColor(BgColor.White);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitEmail = (e: any) => {
    e.preventDefault()
    if (email) {
      WebService.forgotPassword({
        email: email,
      }).subscribe(async (data) => {
        if (data.ok) {
          setEmailSent(true);
          setColor(BgColor.Yellow);
        } else {
          alert.error("There is no user associated with that email address.");
        }
      });
    }
  };

  return (
    <div className="forgot-password">
      {emailSent ? (
        <>
          <h2 className="header">Check your inbox.</h2>
          <p className="text">We emailed you instructions for setting your password.</p>
        </>
      ) : (
        <form className="form" onSubmit={submitEmail}>
          <h2 className="header">Forgot your password?</h2>
          <p className="text">Enter your email address below, and we'll send you instructions for setting a new one.</p>
          <input
            type="text"
            placeholder="Email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
