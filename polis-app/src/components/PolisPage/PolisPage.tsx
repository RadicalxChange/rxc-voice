import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PolisPageRouteParams } from "../../models/PolisPageRouteParams";
import { PolisProps } from "../../models/PolisProps"
import moment from "moment";
import logo from '../../assets/logo.svg';
import publicIp from "public-ip";
import { fromString } from 'uuidv4';

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
  const thisCookie = props.cookies[conversationId];
  console.log("cookie found on page load: " + thisCookie);
  const [canVote, setCanVote] = useState(!!thisCookie);
  const [showCookieBanner, setShowCookieBanner] = useState(!!!thisCookie);

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
 }, [props.conversations, canVote]);

  const allowCookies = () => {
    (async () => {
        const userIp = await publicIp.v6();
        const title = conversation ? conversation.title : '';
        props.setCookie(conversationId, fromString(moment().toDate() + userIp + title), {
          path: "/",
          expires: moment().add(1, "days").toDate(),
          sameSite: "lax",
        });
        setShowCookieBanner(showCookieBanner => false);
        setCanVote(canVote => true);
      }
    )();
  };

  return (
    <div className="polis-page">
      <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <Link
          to='/'
          className="back-button"
        >
        Back to Home
        </Link>
      </header>
      {conversation ? (
        <div className="body">

          <div className={`cookie-banner ${!showCookieBanner ? "closed" : ""}`}>
            <h2>can we use cookie?</h2>
            <button
              type="button"
              onClick={() => allowCookies()}
            >
            Yes
            </button>
            <button
              type="button"
              onClick={() => setShowCookieBanner(showCookieBanner => false)}
            >
            No
            </button>
          </div>


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
          >
          </div>
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
