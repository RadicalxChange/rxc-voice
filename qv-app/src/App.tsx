import React from 'react';
import { Route } from "react-router-dom";


import Home from "./components/Home";
import ElectionCreator from "./components/ElectionCreator";
import VotingPage from "./components/VotingPage";
import './App.scss';

function App() {

  return (
    <div className="App">

      <Route path="/" exact render={() => <Home></Home>} />
      <Route
        path="/create-election"
        exact
        render={() => <ElectionCreator></ElectionCreator>}
      />
      <Route
        path="/vote/:electionId/:userId"
        exact
        render={() => <VotingPage></VotingPage>}
      />

    </div>
  );
}

export default App;
