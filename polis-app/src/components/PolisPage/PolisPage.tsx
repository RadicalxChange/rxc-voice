import React, { useEffect } from "react";
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

  useEffect(() => {
    const thisCookie = props.cookies[conversationId];
    console.log("cookie found on page load: " + thisCookie);
    if (thisCookie === undefined) {
      (async () => {
          const userIp = await publicIp.v6();
          const title = conversation ? conversation.title : '';
          props.setCookie(conversationId, fromString(moment().toDate() + userIp + title), {
            path: "/",
            expires: moment().add(1, "days").toDate(),
            sameSite: "lax",
          });
      })();
    }

    const script = document.createElement('script');
    script.src = 'https://pol.is/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="polis-page">
      <header className="header">
        <img src={logo} className="logo" alt="logo" />
      </header>
      {conversation ? (
        <div className="body">
          <Link
            to='/'
            className="back-button"
          >
          Back to Home
          </Link>
          <h2 className="title">{conversation.title}</h2>
          <p>{conversation.description}</p>
          <div
            className='polis'
            data-page_id={conversationId}
            data-site_id={POLIS_SITE_ID}
            data-topic={conversation.title}
            data-ucsd='false'
            data-xid={props.cookies[conversationId]}
          >
          </div>
        </div>
      ) : (
        <div>
          <h2>Conversation not found. Head back to home to find what you're looking for.</h2>
          <Link
            to='/'
            className="back-button"
          >
          Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default PolisPage;
