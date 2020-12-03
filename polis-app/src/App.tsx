import React, { useEffect, useState } from 'react';
import logo from './assets/logo.svg';
import './App.scss';
import { Route } from "react-router-dom";
import Home from "./components/Home";
import PolisPage from "./components/PolisPage";
import { Conversation } from './models/Conversation';
import { WebService } from './services';

function App() {

  const [conversations, setConversations] = useState(new Array<Conversation>());

  useEffect(() => {
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
        render={(props) => <Home {...props} conversations={conversations} />}
      />
      <Route
        path="/conversation/:conversationId"
        exact
        render={(props) => <PolisPage {...props} conversations={conversations} />}
      />

    </div>
  );
}

export default App;
