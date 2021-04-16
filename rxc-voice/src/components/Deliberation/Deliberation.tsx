import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { ProcessPageRouteParams } from "../../models/ProcessPageRouteParams";
import { WebService } from "../../services";
import { getConversation, getId, getTitle } from "../../utils";
import ProcessMenu from "../ProcessMenu";

import "./Deliberation.scss";

function Deliberation() {
  const POLIS_SITE_ID = 'polis_site_id_cG2opQF5hsqj9jGCsr';
  const { processId } = useParams<ProcessPageRouteParams>();
  const { selectedProcess, creditBalance } = useContext(StateContext);
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
      <div className="nav">
        <ProcessMenu />
      </div>
      <div className="body">
      <h1>Deliberation</h1>
      <h2 className="content-header">{getTitle(selectedProcess)}</h2>
      <div className="explain-text">
        <p>Join us as we collectively draft a ballot of proposals to vote on in our election! Submit proposals, share your thoughts, and show your agreement or disagreement with other delegates’ submissions. This is your chance to influence the ballot of items that voters consider in the final election.</p>
        <p>Want to know more about who else gets a say in this process? Go back to the Delegation Stage to see how the delegation was determined democratically.</p>
      </div>
      {(conversation && WebService.userobj && creditBalance) ? (
          (moment() < moment(conversation.end_date)) ? (
            (moment() > moment(conversation.start_date)) ? (
              <>
              <p className="explain-text"><strong>The Deliberation Stage closes on {moment(conversation.end_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
              {(creditBalance! >= 25) ? (
                <>
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
                ) : null}
                </>
              ) : (
                <p className="insufficient-credits">Sorry! You do not have enough voice credits to participate in Deliberation or Election. The threshold for participation is 25 voice credits.</p>
              )}
              </>
            ) : (
              <p className="explain-text"><strong>The Deliberation Stage begins on {moment(conversation.start_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
            )
          ) : (
            <div className="body">
              <p className="explain-text"><strong>The Deliberation Stage has concluded. You can see the results of the conversation below!</strong></p>
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
    </div>
  );
}

export default Deliberation;
