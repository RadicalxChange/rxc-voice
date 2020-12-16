import React, { useEffect } from "react";
import { Conversation } from "../../models/Conversation";
import ConvoCard from "./components/ConvoCard";
import { BgColor } from "../../models/BgColor";

import "./Home.scss";

function Home(props:any) {

  useEffect(() => {
    props.changeColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <div className="convo-list">
        <h1>RxC Deliberation</h1>
        <p>Click on a conversation below to participate! Powered by Pol.is.</p>
        <h2>Active</h2>
          {props.conversations.length ? (
            <ul>
              {props.conversations.map((conversation: Conversation) => (
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
