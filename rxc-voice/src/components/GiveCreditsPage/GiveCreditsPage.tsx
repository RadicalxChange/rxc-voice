import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { WebService } from "../../services";
import moment from "moment";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { getId, getRecipient, getTitle } from "../../utils";
import { Link } from "react-router-dom";
import slugify from "react-slugify";

import "./GiveCreditsPage.scss";

function GiveCreditsPage() {
    const { processId } = useParams<any>();
    const { setColor, selectProcess, updateCreditBalance } = useContext(ActionContext);
    const { stagedTransfer, creditBalance, selectedProcess } = useContext(StateContext);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [showAbout, setShowAbout] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState(false);

    useEffect(() => {
      setColor(BgColor.White)
      if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
        selectProcess(processId);
      }
      if (stagedTransfer) {
        if (getRecipient(stagedTransfer)) {
          setRecipientEmail(recipientEmail => getRecipient(stagedTransfer).public_username);
        }
      }

     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const submit = () => {
      if (recipientEmail && amount) {
        WebService.postTransfer({
          sender: WebService.userobj.id,
          recipient: recipientEmail,
          amount: amount,
          date: moment().toISOString(),
          process: processId,
        }).subscribe(async (data) => {
          if (data.ok) {
            selectProcess(processId);
            if (creditBalance !== null) {
              updateCreditBalance(creditBalance! - (+amount));
            }
            setTransferSuccess(true);
            setRecipientEmail("");
            setAmount("");
          } else {
            const error = await data.json();
            console.log(error);
          }
        });
      }
    };

    return (
        <div className="give-credits-page">
          <div className="about">
            <h2 className="title">Giving Credits</h2>
            <span>
              You can use the form to the left to send some of your voice
              credits to another person. If you want to send credits to someone
              who is already a delegate in this process, simply enter their
              email address or username. If you would like to invite someone
              who isn't already a delegate, enter their email address.
            </span>
            {!showAbout ? (
              <button
                type="button"
                className="show-hide"
                onClick={() => setShowAbout(showAbout => true)}
              >
              About the process
              </button>
            ) : (
              <div className="about">
                <h3>Delegation</h3>
                <span>
                  The process begins with the Delegation Stage. In this stage,
                  you can invite others to participate by sending them
                  voice credits. You can also send voice credits to other existing
                  delegates. At the end of the Delegation Stage, we match all your
                  transfers using Quadratic Funding! This gives you the power to
                  democratically determine who gets a voice in the decision making
                  process, and how strong each delegate's voice will be.
                </span>
                <h3>Deliberation</h3>
                <span>
                  In the Deliberation Stage, you have the power to submit proposals
                  for the final ballot! This stage is a conversation, where delegates
                  can communicate the insights, opinions, or values/principles that
                  they feel are relevant to the decision on the table. You can also
                  "agree" or "disagree" with other delegates' posts. At the end of
                  this stage, the administrators will curate the posts that generated
                  the highest degree of consensus into a user-generated ballot for
                  the final vote.
                </span>
                <h3>Election</h3>
                <span>
                  The Election stage is where delegates will vote on the proposals
                  generated in the Deliberation Stage. This stage captures a detailed
                  image of individual preferences using Quadratic Voting and publishes
                  them for all delegates to see.
                </span>
                <button
                  type="button"
                  className="show-hide"
                  onClick={() => setShowAbout(showAbout => false)}
                >
                Show less
                </button>
              </div>
            )}
          </div>
          <div className="content">
            <h1 className="title">give credits</h1>
            <input
              type="number"
              placeholder="0"
              className="amount-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="email"
              placeholder="example@mail.com"
              className="recipient-field"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />

            <button
              type="button"
              className="submit-button"
              onClick={() => submit()}
              >
              submit
            </button>
            <p className={`transfer-success ${!transferSuccess ? "hide" : ""}`}>Transfer complete!</p>
            <Link
            to={`/${processId}/${slugify(getTitle(selectedProcess))}/Delegation`}
            className="back-button"
            >
            Back to Delegation
            </Link>
          </div>
        </div>
    );
}

export default GiveCreditsPage;
