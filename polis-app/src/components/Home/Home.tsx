import React from "react";
import { PolisProps } from "../../models/PolisProps"
import ConvoCard from "./components/ConvoCard";
import logo from '../../assets/logo.svg';

import "./Home.scss";

function Home(props:PolisProps) {

  return (
    <div className="home">
      <header className="header">
        <img src={logo} className="home-logo" alt="logo" />
      </header>
      <div className="subheader">
        <h1>RxC Deliberation</h1>
        <p>Click on a conversation below to participate! Powered by Pol.is.</p>
      </div>
      <div className="convo-list">
        <h2>Active</h2>
          {props.conversations.length ? (
            <ul>
              {props.conversations.map(conversation => (
                <ConvoCard conversation={conversation} key={conversation.id} />
              ))}
            </ul>
          ) : (
            <h3>None</h3>
          )}
      </div>
    </div>
  );
}

export default Home;
