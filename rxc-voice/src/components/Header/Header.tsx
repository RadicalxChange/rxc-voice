import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

import "./Header.scss";

function Header() {

  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <ul className="nav">
        <Link
        to={`/about`}
        className="nav-link"
        >
        ABOUT
        </Link>
        <Link
        to={`/`}
        className="nav-link"
        >
        PARTICIPATE
        </Link>
        <Link
        to={`/delegates`}
        className="nav-link"
        >
        DELEGATES
        </Link>

        <Link
        to={`/account`}
        className="nav-link"
        >
        ACCOUNT
        </Link>
      </ul>
    </div>
  );
}

export default Header;
