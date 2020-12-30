import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

import "./Header.scss";

function Header() {

  return (
    <div className="App-header">
      <a
      href='https://radicalxchange.org'
      className="App-logo"
      >
        <img src={logo} className="App-logo" alt="logo" />
      </a>
      <ul className="nav">
        <Link
        to={`/about`}
        className="nav-link"
        >
        About
        </Link>
        <Link
        to={`/`}
        className="nav-link"
        >
        Participate
        </Link>
        <Link
        to={`/delegates`}
        className="nav-link"
        >
        Delegates
        </Link>
        <Link
        to={`/account`}
        className="nav-link"
        >
        Account
        </Link>
      </ul>
    </div>
  );
}

export default Header;
