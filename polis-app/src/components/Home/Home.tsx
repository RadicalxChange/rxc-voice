import React, { useEffect, useState } from "react";
import { Conversation } from "../../models/Conversation";
import ConvoCard from "./components/ConvoCard";
import { BgColor } from "../../models/BgColor";
import moment from "moment";

import "./Home.scss";

function Home(props:any) {
  var activeList: any = [];
  var pastList: any = [];
  props.conversations.forEach((conversation: Conversation) => {
    if (moment(conversation.end_date) > moment()) {
      activeList.push(conversation);
    } else {
      pastList.push(conversation);
    }
  });

  useEffect(() => {
    props.changeColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="home">
      <div className="about">
        <h1>RxC Conversations</h1>
        <span>
          Welcome to RxC Conversations, RadicalxChange’s platform for
          deliberation at scale! Click on a topic to share your insights,
          engage with others, and push important conversations forward
          with the power of Pol.is!
        </span>
        {!showAbout ? (
          <button
            type="button"
            className="show-hide"
            onClick={() => setShowAbout(showAbout => true)}
          >
          How to participate
          </button>
        ) : (
          <div className="about">
            <h3>Voting</h3>
            <span>
              When you click on a conversation, you will see a stack of
              comments posted by other users. Click to “agree” or “disagree”
              with each comment--your opinions are crucial to advancing the
              conversation.
            </span>
            <h3>Commenting</h3>
            <span>
              We want to hear your unique perspective! We encourage you to post
              as many of your own comments as you like. Great comments might
              communicate new insights, opinions, or values/principles you feel
              are relevant to the conversation. However, make sure that each
              comment contains only one distinct idea. If it's possible that
              someone else might agree with part of your comment and disagree
              with another, then you should split those two parts into separate
              comments. Comments that contain more than one idea may be taken
              down or altered by moderators.
            </span>
            <a
              className="polis-link"
              href="https://roamresearch.com/#/app/polis-methods/page/yYRydgFpz"
            >Read more in the official Pol.is documentation.
            </a>
            <button
              type="button"
              className="show-hide"
              onClick={() => setShowAbout(showAbout => false)}
            >
            Show less
            </button>
          </div>
        )}
      </div>
      <div className="convo-list">
        <h2>Active</h2>
          {activeList.length ? (
            <ul>
              {activeList.map((conversation: Conversation) => (
                <ConvoCard conversation={conversation} key={conversation.id} />
              ))}
            </ul>
          ) : (
            <h3>None</h3>
          )}
        <h2>Past</h2>
          {pastList.length ? (
            <ul>
              {pastList.map((conversation: Conversation) => (
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
