import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PolisPageRouteParams } from "../../models/PolisPageRouteParams";
import { PolisProps } from "../../models/PolisProps"
import moment from "moment";
import CookieBanner from "./CookieBanner";
import { BgColor } from "../../models/BgColor";

import "./PolisPage.scss";

function PolisPage(props:PolisProps) {
  const POLIS_SITE_ID = process.env.REACT_APP_SITE_ID;
  const { conversationId } = useParams<PolisPageRouteParams>();
  const conversation = props.conversations.find(
    conversation => conversation.id === +conversationId);
  // user can only comment if conversation is still open
  const canComment = conversation !== undefined &&
    moment(conversation.end_date) > moment();
  // user can only vote if we have a cookie identifying them
  let thisCookie = props.cookies[conversationId];
  const ongoing = conversation ? (moment(conversation.end_date) > moment()) : false;
  const [canVote, setCanVote] = useState(!!thisCookie && ongoing);
  if (!ongoing) {
    thisCookie = 1;
  }

  useEffect(() => {
    props.changeColor(BgColor.White);
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
 }, [props.conversations, canVote]);

  return (
    <div className="polis-page">
      <Link
        to='/'
        className="back-button"
      >
      Back to Home
      </Link>
      {conversation ? (
        <div className="body">
          <h2 id="head" className="title">{conversation.title}</h2>
          <p>{conversation.description}</p>
          <div
            id="polis-iframe"
            className='polis'
            data-page_id={conversationId}
            data-site_id={POLIS_SITE_ID}
            data-topic={conversation.title}
            data-ucv={canVote}
            data-ucw={canComment}
            data-ucsd='false'
            data-xid={props.cookies[conversationId]}
            data-auth_needed_to_vote='false'
            data-auth_needed_to_write='false'
          >
          </div>
          <CookieBanner thisCookie={thisCookie} setCookie={props.setCookie} setCanVote={setCanVote} />
        </div>
      ) : (
        <div className="body">
          <h2>Conversation not found. Head back to home to find what you're looking for.</h2>
        </div>
      )}
    </div>
  );
}

export default PolisPage;
