import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

import "./Home.scss";

function Home() {

  return (
    <div className="home">
      <header className="header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="body">
        <h1>RxC QV</h1>
        <p>Welcome to RadicalxChange's Quadratic Voting tool!</p>
        <p>Click below to create a QV election.</p>

        <div className="create-button">
          <Link
            to='/create-election'
            className="button-text"
          >
          create election
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
