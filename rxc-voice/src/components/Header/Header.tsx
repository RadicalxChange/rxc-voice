import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/icons/logo.svg';

import "./Header.scss";

function Header() {

  return (
    <div className="App-header">
      <a
      href='https://radicalxchange.org'
      className="logo-container"
      >
        <img src={logo} className="App-logo" alt="logo" />
      </a>
      <ul className="nav">
        <Link
        to={`/`}
        className="nav-link"
        >
        Home
        </Link>
        <Link
        to={`/about`}
        className="nav-link"
        >
        About
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
