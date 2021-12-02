import React, { useContext } from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { StateContext } from './hooks';
import "react-datetime/css/react-datetime.css";
import Home from "./components/Home";
import CreateEvent from "./components/CreateEvent";
import Header from './components/Header';
import Login from './components/Login';
import Account from './components/Account';
import ValidationPage from './components/ValidationPage';
import About from './components/About';
import Callback from './components/Callback';
import ProcessPage from './components/ProcessPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound';
import LandingPage from './components/LandingPage';
import { User } from './models/User';
import { getUserData } from './utils';

import './App.scss';

function App() {
  const { color } = useContext(StateContext);
  const user: User | undefined = getUserData();

  return (
    <div className="App" style={{ background: color }} >
      <Switch>
        <Route path="/" exact>
          {user?.is_verified ? (
            <>
              <Header />
              <Home />
            </>
          ) : (
            <LandingPage />
          )}
        </Route>

        <Route
          path="/login"
          exact
          render={() => <Login />}
        />

        <Route
          path="/password-reset"
          exact
          render={() => <ResetPassword />}
        />

        <Route
          path="/forgot-password"
          exact
          render={() => <ForgotPassword />}
        />

        <Route
          path="/verify"
          exact
          render={() => <ValidationPage />}
        />

        <Route
          path="/oauth2/callback"
          render={() => <Callback />}
        />

        {/* Redirect anything else to login if user is not already logged in */}
        {!user?.is_verified ? (
          <Redirect to="/login" />
        ) : null}

        <Route path="/create-event" exact>
          <Header />
          <CreateEvent />
        </Route>

        <Route path="/:processId/:processSlug/:stageId/:stageSlug" exact>
          <Header />
          <ProcessPage />
        </Route>

        <Route path="/account" exact>
          <Header />
          <Account />
        </Route>

        <Route path="/about" exact>
          <Header />
          <About />
        </Route>

        {/* Catch all - for everything else, display 404 Not Found */}
        <Route render={() => <NotFound />} />
      </Switch>

    </div>
  );
}

export default App;
