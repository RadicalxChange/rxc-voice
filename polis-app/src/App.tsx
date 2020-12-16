import React, { useEffect, useState } from 'react';
import './App.scss';
import { Route } from "react-router-dom";
import Header from './components/Header';
import Home from "./components/Home";
import PolisPage from "./components/PolisPage";
import { BgColor } from "./models/BgColor"
import { Conversation } from './models/Conversation';
import { WebService } from './services';
import { useCookies } from 'react-cookie';

function App() {
  const yellowColor = "var(--yellowColor)";
  const whiteColor = "var(--whiteColor)";

  const [conversations, setConversations] = useState(new Array<Conversation>());
  const [cookies, setCookie] = useCookies();
  const [color, setColor] = useState(yellowColor);

  useEffect(() => {
    console.log("loading from database...");
    WebService.fetchConversations().subscribe((data: Conversation[]) => {
      setConversations(conversations => data);
    });

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeColor = (newColor: BgColor) => {
    switch (newColor) {
      case BgColor.Yellow: {
        setColor(color => yellowColor);
        break;
      }
      case BgColor.White: {
        setColor(color => whiteColor);
        break;
      }
    }
  };

  return (
    <div className="App" style={{ background: color }} >

      <Header></Header>

      <Route
        path="/"
        exact
        render={(props) => <Home {...props} conversations={conversations} changeColor={changeColor} />}
      />
      <Route
        path="/conversation/:conversationId"
        exact
        render={(props) => <PolisPage {...props} cookies={cookies} setCookie={setCookie} conversations={conversations} changeColor={changeColor} />}
      />

    </div>
  );
}

export default App;
