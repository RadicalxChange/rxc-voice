import React, { useContext } from 'react';
import { Route } from "react-router-dom";
import { StateContext } from './hooks';
import Home from "./components/Home";
import Header from './components/Header';
import Login from './components/Login';
import Account from './components/Account';
import ProcessPages from './components/ProcessPages';
import GiveCreditsPage from './components/GiveCreditsPage';
import ValidationPage from './components/ValidationPage';
import About from './components/About';

import './App.scss';

function App() {
  const { user, color } = useContext(StateContext);

  if (!user) {
    return <Login />
  }
  return (
    <div className="App" style={{ background: color }} >

      <Header></Header>

      <Route
        path="/"
        exact
        render={() => <Home></Home>}
      />

      <Route
        path="/:processId/:processSlug/:stage"
        exact
        render={() => <ProcessPages></ProcessPages>}
      />

      <Route
        path="/give-credits"
        exact
        render={() => <GiveCreditsPage></GiveCreditsPage>}
      />

      <Route
        path="/account"
        exact
        render={() => <Account></Account>}
      />

      <Route
        path="/about"
        exact
        render={() => <About></About>}
      />

      <Route
        path="/verify"
        exact
        render={() => <ValidationPage></ValidationPage>}
      />

    </div>
  );
}

export default App;
