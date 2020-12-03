import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PolisPageRouteParams } from "../../models/PolisPageRouteParams";
import { PolisProps } from "../../utils";
import logo from '../../assets/logo.svg';

import "./PolisPage.scss";

function PolisPage(props:PolisProps) {
  const POLIS_SITE_ID = process.env.REACT_APP_SITE_ID;
  const { conversationId } = useParams<PolisPageRouteParams>();
  const conversation = props.conversations.find(
    conversation => conversation.id === +conversationId);

  useEffect(() => {
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
        <img src={logo} className="logo" />
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
