import React, { useEffect } from 'react';
import { Route, Redirect, useHistory } from "react-router-dom";


import Home from "./components/Home";
import ElectionCreator from "./components/ElectionCreator";
import logo from './assets/RadicalxChange_yellow.png';
import './App.scss';

function App() {

  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <Route path="/" exact render={() => <Home></Home>} />
      <Route
        path="/create-election"
        exact
        render={() => <ElectionCreator></ElectionCreator>} />

    </div>
  );
}

export default App;
