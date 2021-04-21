import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import DelegateCard from "./components/DelegateCard";
import { Delegate } from "../../models/Delegate";
import { getAmount, getConversation, getDelegates, getId, getMatchingPool, getRecipient, getTitle, mapToTransfers, userobj } from "../../utils";
import moment from "moment";
import { WebService } from "../../services";
import { Transfer } from "../../models/Transfer";
import TransferCard from "./components/TransferCard";
import ProcessMenu from "../ProcessMenu";
import TransferModal from "./components/TransferModal";

import "./Delegation.scss";

function Delegation() {
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess, creditBalance, loading } = useContext(StateContext);
  const { selectProcess, updateCreditBalance, setColor } = useContext(ActionContext);
  const conversation = getConversation(selectedProcess);
  const [transfers, setTransfers] = useState(new Array<Transfer>());
  const [subtotal, setSubtotal] = useState(0);
  const [match, setMatch] = useState(0);
  const delegationOngoing = conversation && moment() < moment(conversation.start_date);
  const [stagedTransfer, setStagedTransfer] = useState("");
  const [inviteModal, setInviteModal] = useState(false);

  useEffect(() => {
    setColor(BgColor.White);
    if (processId && (!selectedProcess || (getId(selectedProcess) !== +processId))) {
      selectProcess(processId);
    }

    if (!delegationOngoing) {
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

  const submitTransfer = () => {
    if (stagedTransfer) {
      if (getRecipient(stagedTransfer) && getAmount(stagedTransfer)) {
        WebService.postTransfer({
          sender: userobj().id,
          recipient: getRecipient(stagedTransfer),
          amount: getAmount(stagedTransfer),
          date: moment().toISOString(),
          process: processId,
        }).subscribe(async (data) => {
          if (data.ok) {
            selectProcess(processId);
            if (creditBalance !== null) {
              updateCreditBalance(creditBalance! - (+getAmount(stagedTransfer)));
            }
            setStagedTransfer("");
            setInviteModal(false);
          } else {
            const error = await data.json();
            console.log(error);
          }
        });
      }
    }
  };

  const closeModal = () => {
    setStagedTransfer("");
    setInviteModal(false);
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

  if (loading) {
    return (
      <h2>Loading...</h2>
    );
  } else {
    return (
      selectedProcess ? (
        <div className="delg-page">
          <div className="nav">
            <ProcessMenu />
          </div>
          <TransferModal
            invite={inviteModal}
            recipient={stagedTransfer}
            submitTransfer={submitTransfer}
            closeModal={closeModal}
          />
          <div className="body">
            <div className="delegation-content">
              <h1>Delegation</h1>
              <h2>{getTitle(selectedProcess)}</h2>
              <div className="explain-text">
                <p>Welcome to the RxC Voice democratic process! We want to make this decision democratically, so we have to start by deciding who gets to participate. Let’s start with why you’re here. Someone thought you should have a say in this decision, so they gave you some of their voice credits. Voice credits are used for voting in the election later on.</p>
                <p>Is there anyone you don’t see in the list below that you think should have a say? Send them some of your voice credits to invite them.
                  <strong> Note:</strong> to keep the dry run private, we ask that you please only invite "new" people from{" "}
                  <a className="inline-link" href="https://docs.google.com/spreadsheets/d/1QLTC4aqvICnb3_YuUJvD9UQBQdEQqZev5MRdK8lEHnI/edit?usp=sharing"
                  >this list.
                  </a>
                </p>
                <p>You can also give voice credits to someone who is already here if you trust them and want them to have greater influence in the election. At the end of this stage, all voice credit transfers will be matched using Quadratic Funding! If you want to save all of your credits for your own use in the election, that’s fine too.</p>
                <p>Keep in mind, the threshold for participating in Delegation and Election is 25 voice credits. If you want to participate in the decision, <strong>make sure you keep at least 25 voice credits for yourself.</strong></p>
              </div>
              {conversation && delegationOngoing ? (
                <>
                <p className="explain-text"><strong>The Delegation Stage closes on {moment(conversation.start_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
                <h3 className="matching-pool">Matching Fund: {getMatchingPool(selectedProcess)} voice credits.</h3>
                <button
                  type="button"
                  className="submit-button"
                  onClick={() => setInviteModal(true)}
                >
                  + Invite someone else
                </button>
                </>
              ) : (
                <>
                <p className="explain-text"><strong>The Delegation Stage has concluded. You can see the final delegate list below!</strong></p>
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
                </>
              )}
              {getDelegates(selectedProcess)!.filter(isVerified).length ? (
                <>
                  <h2>Delegates</h2>
                  <ul className="delegate-list">
                    {getDelegates(selectedProcess)!
                      .filter(isVerified)
                      .map((delegate: Delegate) => (
                        <DelegateCard
                          key={delegate.id}
                          delegate={delegate}
                          process={selectedProcess}
                          stageTransfer={setStagedTransfer}
                        >
                        </DelegateCard>
                      ))}
                    </ul>
                  </>
              ) : (
                <h3>No delegates found.</h3>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1>Process not found. Return to home.</h1>
      )
    );
  }
}

export default Delegation;
