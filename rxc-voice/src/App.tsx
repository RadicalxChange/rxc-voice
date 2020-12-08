import React from 'react';
import { Route } from "react-router-dom";

import Home from "./components/Home";
// import VotingPage from "./components/VotingPage";
import './App.scss';

function App() {
  return (
    <div className="App">

      <Route path="/" exact render={() => <Home></Home>} />

    </div>
  );
}

export default App;
