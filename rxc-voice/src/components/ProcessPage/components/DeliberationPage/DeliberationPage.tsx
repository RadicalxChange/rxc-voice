import React, { useEffect } from "react";
import { Process } from "../../../../models/Process";
import { getUserData } from "../../../../utils";
import { Conversation } from "../../../../models/Stage";
import { Delegate } from "../../../../models/Delegate";
import moment from "moment";

import "./DeliberationPage.scss";

function DeliberationPage(props: {process: Process, conversation: Conversation, userDelegate: Delegate}) {
  const POLIS_SITE_ID = 'polis_site_id_cG2opQF5hsqj9jGCsr';

  useEffect(() => {
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
  }, []);

  return (
    <div className="polis-page">
      <div className="body">
      <h1>Deliberation</h1>
      <h2 className="content-header">{props.process.title}</h2>
      <div className="explain-text">
        <p>Join us as we collectively draft a ballot of proposals to vote on in our election! Submit proposals, share your thoughts, and show your agreement or disagreement with other delegates’ submissions. This is your chance to influence the ballot of items that voters consider in the final election.</p>
        <p>Want to know more about who else gets a say in this process? Go back to the Delegation Stage to see how the delegation was determined democratically.</p>
      </div>
      {(moment() < moment(props.conversation.end_date)) ? (
        (moment() > moment(props.conversation.start_date)) ? (
            props.userDelegate ? (
              <>
              <p className="explain-text"><strong>The Deliberation Stage closes on {moment(props.conversation.end_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
              {(props.userDelegate.credit_balance >= 25) ? (
                <>
                <div
                  id="polis-iframe"
                  className='polis'
                  data-page_id={props.conversation.uuid}
                  data-site_id={POLIS_SITE_ID}
                  data-topic={props.conversation.title}
                  data-ucv={moment(props.conversation.start_date) < moment()}
                  data-ucw={moment(props.conversation.start_date) < moment()}
                  data-ucsd='false'
                  data-xid={getUserData()?.token}
                  data-auth_needed_to_vote='false'
                  data-auth_needed_to_write='false'
                  data-auth_opt_fb='false'
                  data-auth_opt_tw='false'
                >
                </div>
                {props.conversation.show_report ? (
                  <iframe
                    title="conversation-results"
                    className="results-iframe"
                    src={"https://pol.is/report/" + props.conversation.report_id}
                  >
                  </iframe>
                ) : null}
                </>
              ) : (
                <p className="insufficient-credits">Sorry! You do not have enough voice credits to participate in Deliberation or Election. The threshold for participation is 25 voice credits.</p>
              )}
              </>
            ) : (
              <div className="body">
                <h3>Sorry, something went wrong. Head back to home to find what you're looking for.</h3>
              </div>
            )
        ) : (
          <p className="explain-text"><strong>The Deliberation Stage begins on {moment(props.conversation.start_date).format('MMMM Do YYYY, h:mm a')}</strong></p>
        )
      ) : (
        <div className="body">
          <p className="explain-text"><strong>The Deliberation Stage has concluded. {props.conversation.report_id ? "You can see the results of the conversation below!" : ""}</strong></p>
            {props.conversation.report_id ? (
              <iframe
                title="conversation-results"
                className="results-iframe"
                src={"https://pol.is/report/" + props.conversation.report_id}
              >
              </iframe>
            ) : null}
        </div>
      )}
      </div>
    </div>
  );
}

export default DeliberationPage;
