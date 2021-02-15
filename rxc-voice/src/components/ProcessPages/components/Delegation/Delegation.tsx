import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { Process } from "../../../../models/Process";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import DelegateCard from "./components/DelegateCard";
import { Delegate } from "../../../../models/Delegate";
import { getConversation, getId, mapToTransfers } from "../../../../utils";
import moment from "moment";
import { WebService } from "../../../../services";
import { Transfer } from "../../../../models/Transfer";
import TransferCard from "./components/TransferCard";
import { Link } from "react-router-dom";

import "./Delegation.scss";

function Delegation() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);
  const conversation = getConversation(selectedProcess);
  const [showTransfers, setShowTransfers] = useState(false);
  const [transfers, setTransfers] = useState(new Array<Transfer>());
  const [match, setMatch] = useState(0);

  useEffect(() => {
    setColor(BgColor.Yellow);
    if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
      selectProcess(processId);
    }

    if (conversation && (moment() > moment(conversation.start_date))) {
      setShowTransfers(true);
      WebService.fetchTransfers(processId).subscribe((data: any) => {
        setTransfers(mapToTransfers(data.transfers));
        setMatch(data.match);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, selectedProcess]);

  const getDelegates = (process: Process | null) => {
    if (process) {
      return process.delegates;
    } else {
      return undefined;
    }
  };

  return (
    selectedProcess ? (
      <div className="delg-page">
        <div className="content-header">
        </div>
        {showTransfers ? (
          <div className="transfers">
            <h2>Your transfers</h2>
            <div className="transfers-header">
              <h3 className="col-one">Sender</h3>
              <h3 className="col-two">Recipient</h3>
              <h3 className="col-three">Amount</h3>
            </div>
            {transfers.length ? (
              <>
                <ul className="transfer-list">
                  {transfers.map((transfer: Transfer) => (
                    <TransferCard transfer={transfer} key={transfer.id}></TransferCard>
                  ))}
                </ul>
                <h3>You received {match} voice credits from the matching fund.</h3>
              </>
            ) : (
              <h3>You did not send or receive any transfers.</h3>
            )}
          </div>
        ) : (
          <></>
        )}
        <div className="delegation-content">
          <h2>Delegation</h2>
          <p className="invite">Want to invite someone to participate in the decision that isn't already here?</p>
          <Link
            to={`/${processId}/give-credits`}
            className="invite-link"
          >
          give them credits
          </Link>
          {getDelegates(selectedProcess)!.length ? (
            <ul className="delegate-list">
              {getDelegates(selectedProcess)!.map((delegate: Delegate) => (
                <DelegateCard delegate={delegate} process={selectedProcess} key={delegate.id}></DelegateCard>
              ))}
            </ul>
          ) : (
            <h3>No delegates found.</h3>
          )}
        </div>
      </div>
    ) : (
      <h1>Process not found. Return to home.</h1>
    )
  );
}

export default Delegation;
