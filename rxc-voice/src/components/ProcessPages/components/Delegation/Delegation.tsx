import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { Process } from "../../../../models/Process";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import DelegateCard from "./components/DelegateCard";
import { Delegate } from "../../../../models/Delegate";
import { getConversation, getDelegates, getId, getMatchingPool, mapToTransfers } from "../../../../utils";
import moment from "moment";
import { WebService } from "../../../../services";
import { Transfer } from "../../../../models/Transfer";
import TransferCard from "./components/TransferCard";
import { Link } from "react-router-dom";

import "./Delegation.scss";

function Delegation() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, stageTransfer, setColor } = useContext(ActionContext);
  const conversation = getConversation(selectedProcess);
  const [showTransfers, setShowTransfers] = useState(false);
  const [transfers, setTransfers] = useState(new Array<Transfer>());
  const [subtotal, setSubtotal] = useState(0);
  const [match, setMatch] = useState(0);
  const delegationOngoing = conversation && moment() < moment(conversation.start_date);

  useEffect(() => {
    setColor(BgColor.Yellow);
    if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
      selectProcess(processId);
    }

    if (conversation && (moment() > moment(conversation.start_date))) {
      setShowTransfers(true);
      WebService.fetchTransfers(processId).subscribe((data: any) => {
        processTransferData(data);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId, selectedProcess]);

  const isVerified = (delegate: Delegate, index, array) => {
    return delegate.public_username !== null;
  };

  const processTransferData = (data: any) => {
    const transferData = mapToTransfers(data.transfers);
    const matchData = data.match;
    setTransfers(transferData);
    setMatch(matchData);
    setSubtotal(calcSubtotal(transferData));
  };

  const calcSubtotal = (transferData: Transfer[]) => {
    var subtotal = 0;
    transferData.forEach((transfer: Transfer) => {
      if (transfer.user_is_sender) {
        subtotal -= Number(transfer.amount)
      } else {
        subtotal += Number(transfer.amount)
      }
    });
    return subtotal;
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
              <h3 className="type">Type</h3>
              <h3 className="amount">Amount</h3>
            </div>
            {transfers.length ? (
              <>
                <ul className="transfer-list">
                  {transfers.map((transfer: Transfer) => (
                    <TransferCard transfer={transfer} key={transfer.id}></TransferCard>
                  ))}
                </ul>
                <div className="transfers-subtotals">
                  <div className="type">
                    <h3>Subtotal</h3>
                    <h3>Matching Funds Received</h3>
                  </div>
                  <div className="amount">
                    <h3>{(subtotal < 0) ? "- " : "+ "}{Math.abs(subtotal)} voice credits</h3>
                    <h3>{(match < 0) ? "- " : "+ "}{Math.abs(match)} voice credits</h3>
                  </div>
                </div>
                <div className="transfers-subtotals">
                  <h3 className="total">Total Change</h3>
                  <h3 className="total">{(subtotal + match < 0) ? "- " : "+ "}{Math.abs(subtotal + match)} voice credits</h3>
                </div>
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
          {delegationOngoing ? (
            <p className="about">If you choose to give some of your credits
              to other delegates, your transfer will be matched using
              Quadratic Funding. The size of the matching pool for this
              Delegation is{" "}
              <strong>{getMatchingPool(selectedProcess)} voice credits.</strong>
              <br/><br/>
              Want to invite someone to participate in the decision that
              isn't already here?
              <br/><br/>
              <Link
                to={`/${processId}/give-credits`}
                className="invite-link"
                onClick={(e) => stageTransfer(null)}
              >
                give them credits
              </Link>
            </p>
          ) : (
            <></>
          )}
          {getDelegates(selectedProcess)!.filter(isVerified).length ? (
            <ul className="delegate-list">
              {getDelegates(selectedProcess)!
                .filter(isVerified)
                .map((delegate: Delegate) => (
                  <DelegateCard
                    delegate={delegate}
                    process={selectedProcess}
                    key={delegate.id}
                  >
                  </DelegateCard>
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
