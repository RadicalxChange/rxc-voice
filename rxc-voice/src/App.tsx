import React, { useState } from 'react';
import { Route } from "react-router-dom";
import Home from "./components/Home";
import Header from './components/Header';
// import VotingPage from "./components/VotingPage";
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


  return (
    <div className="App" style={{ background: color }} >

      <Header></Header>

      <Route
        path="/"
        exact
        render={() => <Home changeColor={changeColor}></Home>}
      />

    </div>
  );
}

export default App;
