import React, { useContext } from 'react';
import { Route, useLocation } from "react-router-dom";
import { StateContext } from './hooks';
import Home from "./components/Home";
import Header from './components/Header';
import Login from './components/Login';
import Account from './components/Account';
import ProcessPages from './components/ProcessPages';
import GiveCreditsPage from './components/GiveCreditsPage';
import ValidationPage from './components/ValidationPage';
import About from './components/About';
import Callback from './components/Callback';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

import './App.scss';

function App() {
  const location = useLocation();
  const linkToken = new URLSearchParams(location.search).get('token');
  const { user, color } = useContext(StateContext);

  if (linkToken) {
    return (
      <div className="App" style={{ background: color }} >
        <Route
          path="/"
          exact
          render={() => <Login />}
        />
        <Route
          path="/verify"
          exact
          render={() => <ValidationPage />}
        />
        <Route
          path="/password-reset"
          exact
          render={() => <ResetPassword />}
        />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="App" style={{ background: color }} >
        <Route
          path="/"
          exact
          render={() => <Login />}
        />
        <Route
          path="/forgot-password"
          exact
          render={() => <ForgotPassword />}
        />
      </div>
    );
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
        path="/:processId/give-credits"
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

      <Route
        path="/oauth2/callback"
        render={() => <Callback></Callback>}
      />

    </div>
  );
}

export default App;
