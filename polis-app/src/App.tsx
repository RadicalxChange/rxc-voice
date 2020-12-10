import React, { useEffect, useState } from 'react';
import './App.scss';
import { Route } from "react-router-dom";
import Home from "./components/Home";
import PolisPage from "./components/PolisPage";
import { Conversation } from './models/Conversation';
import { WebService } from './services';
import { useCookies } from 'react-cookie';

function App() {

  const [conversations, setConversations] = useState(new Array<Conversation>());
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    console.log("loading from database...");
    WebService.fetchConversations().subscribe((data: Conversation[]) => {
      setConversations(conversations => data);
    });

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">

      <Route
        path="/"
        exact
        render={(props) => <Home {...props} cookies={cookies} setCookie={setCookie} conversations={conversations} />}
      />
      <Route
        path="/conversation/:conversationId"
        exact
        render={(props) => <PolisPage {...props} cookies={cookies} setCookie={setCookie} conversations={conversations} />}
      />

    </div>
  );
}

export default App;
