import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../../../hooks";
import { BgColor } from "../../../../models/BgColor";
import { ProcessPageRouteParams } from "../../../../models/ProcessPageRouteParams";
import { WebService } from "../../../../services";
import { getConversation, getCurationInfo, getId } from "../../../../utils";

import "./Deliberation.scss";

function Deliberation() {
  const POLIS_SITE_ID = 'polis_site_id_cG2opQF5hsqj9jGCsr';
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess } = useContext(StateContext);
  const { selectProcess, setColor } = useContext(ActionContext);
  const conversation = getConversation(selectedProcess);

  useEffect(() => {
    setColor(BgColor.White);
    if (processId && (!selectedProcess || getId(selectedProcess) !== +processId)) {
      selectProcess(processId);
    }
    // load pol.is embed script
    console.log("loading script...")
    const script = document.createElement('script');
    script.src = 'https://pol.is/embed.js';
    script.async = true;
    document.body.appendChild(script);
    console.log("script loaded.");

    // clean up pol.is embed script and iframes
    return () => {
      console.log("cleaning up script...");
      document.body.removeChild(script);
      const polisDiv = document.getElementById("polis-iframe");
      if (!!polisDiv) {
        console.log("unmounting iframe... ");
        while (polisDiv.firstChild) {
          polisDiv.removeChild(polisDiv.firstChild);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processId]);

  return (
    <div className="polis-page">
      <h2 className="content-header">Deliberation</h2>
      <p>{getCurationInfo(selectedProcess)}</p>
      {(conversation && WebService.userobj) ? (
          (moment(conversation.end_date) > moment()) ? (
            <div className="body">
              <div
                id="polis-iframe"
                className='polis'
                data-page_id={conversation.uuid}
                data-site_id={POLIS_SITE_ID}
                data-topic={conversation.title}
                data-ucv={moment(conversation.start_date) < moment()}
                data-ucw={moment(conversation.start_date) < moment()}
                data-ucsd='false'
                data-xid={WebService.userobj.token}
                data-auth_needed_to_vote='false'
                data-auth_needed_to_write='false'
                data-auth_opt_fb='false'
                data-auth_opt_tw='false'
              >
              </div>
              {conversation.show_report ? (
                <iframe
                  title="conversation-results"
                  className="results-iframe"
                  src={"https://pol.is/report/" + conversation.report_id}
                >
                </iframe>
              ) : (
                <h3>No report to show at this time.</h3>
              )}
            </div>
          ) : (
            <div className="body">
              <iframe
                title="conversation-results"
                className="results-iframe"
                src={"https://pol.is/report/" + conversation.report_id}
              >
              </iframe>
            </div>
          )
      ) : (
        <div className="body">
          <h3>Conversation not found. Head back to home to find what you're looking for.</h3>
        </div>
      )}
    </div>
  );
}

export default Deliberation;
