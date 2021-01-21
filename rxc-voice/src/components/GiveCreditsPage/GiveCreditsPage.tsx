import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { WebService } from "../../services";
import moment from "moment";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { getRecipient } from "../../utils";

import "./GiveCreditsPage.scss";

function GiveCreditsPage() {
    const { processId } = useParams<any>();
    const { setColor, fetchProcesses } = useContext(ActionContext);
    const { stagedTransfer } = useContext(StateContext);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
      setColor(BgColor.White)
      fetchProcesses();
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
            console.log(data);
          } else {
            const error = await data.json();
            console.log(error);
          }
        });
      }
    };

    return (
        <div className="give-credits-page">
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

        </div>
    );
}

export default GiveCreditsPage;
