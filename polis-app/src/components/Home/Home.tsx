import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { WebService } from "../../services";
import { Conversation } from "../../models/Conversation";

import "./Home.scss";

function Home() {

  const [conversations, setConversations] = useState(new Array<Conversation>());

  useEffect(() => {
    WebService.fetchConversations().subscribe((data: Conversation[]) => {
      setConversations(conversations => data);
    });


   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
        <h1>RxC Deliberation</h1>
        <p>Click on a conversation below to participate! Powered by Pol.is.</p>

        <div className="create-button">
        <h2>Active</h2>
          <ul>
            {conversations.map(conversation => (
              <li className="conversation-card" key={conversation.id}>
                <label>{conversation.title}</label>
                  <Link
                    to='/' + conversation.id
                    className="button-text"
                  >
                  go to conversation
                  </Link>
              </li>
            ))}
          </ul>
        <h2>Past</h2>


          <Link
            to='/create-election'
            className="button-text"
          >
          create election
          </Link>
        </div>

    </div>
  );
}

export default Home;
