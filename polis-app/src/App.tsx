import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <Route path="/" exact render={() => <Home></Home>} />
      <Route
        path="/:conversationid"
        exact
        render={() => <PolisPage></PolisPage>}
      />

    </div>
  );
}

export default App;
