import React, { useState } from 'react';
import { Route } from "react-router-dom";
import Home from "./components/Home";
import Header from './components/Header';
import Login from './components/Login';
import Account from './components/Account';
import ProcessPages from './components/ProcessPages';
import { BgColor } from "./models/BgColor"

import './App.scss';

function App() {
  const yellowColor = "var(--yellowColor)";
  const whiteColor = "var(--whiteColor)";

  const [color, setColor] = useState(yellowColor);
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

  const [user, setUser] = useState(sessionStorage.getItem("user"));
  if (!user) {
    return <Login changeColor={changeColor} setUser={setUser} />
  }

  return (
    <div className="App" style={{ background: color }} >
      {console.log(sessionStorage.getItem("user"))}

      <Header></Header>

      <Route
        path="/"
        exact
        render={() => <Home changeColor={changeColor}></Home>}
      />

      <Route
        path="/:processId/:processSlug/:stage"
        exact
        render={() => <ProcessPages changeColor={changeColor}></ProcessPages>}
      />

      <Route
        path="/account"
        exact
        render={() => <Account changeColor={changeColor} setUser={setUser} ></Account>}
      />

    </div>
  );
}

export default App;
