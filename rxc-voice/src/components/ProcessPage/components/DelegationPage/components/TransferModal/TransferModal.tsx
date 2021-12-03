import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import moment from "moment";
import { useAlert } from "react-alert";
import { ActionContext } from "../../../../../../hooks";
import { WebService } from "../../../../../../services";
import { getUserData, updateCreditBalance } from "../../../../../../utils";
import { User } from "../../../../../../models/User";
import { Delegate } from "../../../../../../models/Delegate";

import "./TransferModal.scss";

function TransferModal(props: any) {
    const { processId } = useParams<any>();
    const { selectProcess, setUserData } = useContext(ActionContext);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [estMatch, setEstMatch] = useState(0);
    const [thresholdWarning, setThresholdWarning] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState(false);

    const alert = useAlert()

    const submit = (userDelegate: Delegate) => {
      setThresholdWarning(false);
      WebService.postTransfer({
        sender: userDelegate.id,
        recipient: props.recipient ? props.recipient.id : recipientEmail,
        amount: amount,
        date: moment().toISOString(),
        delegation: props.delegation.id,
      }).subscribe(async (data) => {
        if (data.ok) {
          setTransferSuccess(true);
          const user: User | undefined = getUserData();
          if (user) {
            const userData = updateCreditBalance(user, props.process, userDelegate.credit_balance - (+amount));
            setUserData(userData);
          }
        } else {
          const error = await data.json();
          alert.error(error.non_field_errors[0]);
        }
      });
    };

    const maybeSubmit = (userDelegate: Delegate) => {
      console.log(userDelegate)
      const recipient = props.recipient ? props.recipient : recipientEmail;
      if (!recipient || !amount) {
        alert.error("Incomplete form");
      } else if (recipient.id === userDelegate.id) {
        alert.error("You cannot send credits to yourself");
      } else if (+amount > userDelegate.credit_balance) {
        alert.error("Insufficient credits");
      } else if (+amount < 0) {
        alert.error("Invalid amount")
      } else if (userDelegate.credit_balance - (+amount) < 25) {
        setThresholdWarning(true);
      } else {
        submit(userDelegate);
      }
    };

    const reset = () => {
      props.closeModal();
      setRecipientEmail("");
      setAmount("");
      setEstMatch(0);
      if (transferSuccess) {
        selectProcess(processId);
      }
      setTransferSuccess(false);
      setThresholdWarning(false);
    };

    const onChangeAmount = (new_amt, userDelegate: Delegate) => {
      setAmount(new_amt);
      if (new_amt !== "" && props.recipient) {
        WebService.estimateMatch({
          sender: userDelegate.id,
          recipient: props.recipient.id,
          amount: new_amt,
          date: moment().toISOString(),
          delegation: props.delegation.id,
        }).subscribe(async (data) => {
          if (data.ok) {
            const msg = await data.json();
            setEstMatch(msg.estimated_match);
          }
        });
      }
    };

    return (
      <div className="modal">
        {transferSuccess ? (
          <div className={`transfer-modal ${!props.recipient && !props.invite ? "closed" : ""}`}>
            <h2>Transfer successful!</h2>
            <div className="explain-text">
                <p>Note that the voice credits you sent will be withheld from the recipient until the end of the Delegation stage.</p>
            </div>
            <button
              type="button"
              onClick={() => reset()}
              >
              Close
            </button>
          </div>
        ) : (
          <>
          {props.userDelegate ? (
            <>
            {thresholdWarning ? (
              <div className={`transfer-modal ${!props.recipient && !props.invite ? "closed" : ""}`}>
                <div className="give-credits-page">
                  <h2>Threshold Warning</h2>
                  <div className="explain-text">
                    <p>Are you sure you'd like to send {amount} voice credits to {props.recipient ? props.recipient.profile.public_username : recipientEmail}?</p>
                    <p>If you do, your voice credit balance will fall below the threshold for participation (25 voice credits), and you may not be able to participate in the Deliberation and Election Stages.</p>
                  </div>
                  <div className="button-container">
                    <button
                      type="button"
                      className="submit-button"
                      onClick={() => submit(props.userDelegate)}
                      >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => reset()}
                      >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`transfer-modal ${!props.recipient && !props.invite ? "closed" : ""}`}>
                <div className="give-credits-page">
                  <h1 className="title">give credits</h1>
                  <div className="transfer-field-container">
                    <div className="field-label">Amount</div>
                    <input
                      type="number"
                      placeholder="0"
                      className="amount-input"
                      value={amount}
                      onChange={(e) => onChangeAmount(e.target.value, props.userDelegate)}
                    />
                  </div>
                  {props.recipient ? (
                    <div className="transfer-field-container">
                      <div className="field-label">Send to</div>
                      <p className="recipient">{props.recipient.profile.public_username}</p>
                    </div>
                  ) : (
                    <div className="transfer-field-container">
                      <div className="field-label">Send to</div>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        className="email-input"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>
                  )}
                  <p className={`match-estimate ${(estMatch === 0) ? "closed" : ""}`}>
                    Estimated Match: <strong>+ {estMatch} voice credits</strong>
                  </p>
                  <div className="button-container">
                    <button
                      type="button"
                      className="submit-button"
                      onClick={() => maybeSubmit(props.userDelegate)}
                      >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => reset()}
                      >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
          ) : null}
          </>
        )}
        <div
          className={`modal-overlay ${!props.recipient && !props.invite ? "closed" : ""}`}
          onClick={() => reset()}
        ></div>
      </div>
    );
}

export default TransferModal;
