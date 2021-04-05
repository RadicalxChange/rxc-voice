import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { WebService } from "../../../../services";
import moment from "moment";
import { ActionContext, StateContext } from "../../../../hooks";

import "./TransferModal.scss";

function TransferModal(props: any) {
    const { processId } = useParams<any>();
    const { selectProcess, updateCreditBalance } = useContext(ActionContext);
    const { creditBalance } = useContext(StateContext);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [estMatch, setEstMatch] = useState(0);
    const [transferSuccess, setTransferSuccess] = useState(false);

    const submit = () => {
      const recipient = props.recipient ? props.recipient : recipientEmail;
      if (recipient && amount) {
        WebService.postTransfer({
          sender: WebService.userobj.id,
          recipient: recipient,
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
            setEstMatch(0);
          } else {
            const error = await data.json();
            console.log(error);
          }
        });
      }
    };

    const reset = () => {
      props.closeModal();
      setRecipientEmail("");
      setAmount("");
      setEstMatch(0);
      setTransferSuccess(false);
    };

    const onChangeAmount = (new_amt) => {
      setAmount(new_amt);
      if (new_amt !== "") {
        const recipient = props.recipient ? props.recipient : recipientEmail;
        WebService.estimateMatch({
          sender: WebService.userobj.id,
          recipient: recipient,
          amount: new_amt,
          date: moment().toISOString(),
          process: processId,
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
            <button
              type="button"
              className="submit-button"
              onClick={() => reset()}
              >
              close
            </button>
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
                  onChange={(e) => onChangeAmount(e.target.value)}
                />
              </div>
              {props.recipient ? (
                <div className="transfer-field-container">
                  <div className="field-label">Send to</div>
                  <p className="recipient">{props.recipient}</p>
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
                  onClick={() => submit()}
                  >
                  submit
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => reset()}
                  >
                  cancel
                </button>
              </div>
            </div>
        </div>
        )}
        <div
          className={`modal-overlay ${!props.recipient && !props.invite ? "closed" : ""}`}
          onClick={() => reset()}
        ></div>
      </div>
    );
}

export default TransferModal;
