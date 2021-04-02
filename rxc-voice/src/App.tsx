import React, { useContext } from 'react';
import { Route, useLocation } from "react-router-dom";
import { StateContext } from './hooks';
import Home from "./components/Home";
import Header from './components/Header';
import Login from './components/Login';
import Account from './components/Account';
import ValidationPage from './components/ValidationPage';
import About from './components/About';
import Callback from './components/Callback';
import Delegation from './components/Delegation';
import Deliberation from './components/Deliberation';
import Election from './components/Election';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import { userIsVerified } from './utils';

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
  } else if (!userIsVerified(user)) {
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
        <Route
          path="/oauth2/callback"
          render={() => <Callback></Callback>}
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
        path="/:processId/:processSlug/Delegation"
        exact
        render={() => <Delegation></Delegation>}
      />

      <Route
        path="/:processId/:processSlug/Deliberation"
        exact
        render={() => <Deliberation></Deliberation>}
      />

      <Route
        path="/:processId/:processSlug/Election"
        exact
        render={() => <Election></Election>}
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
