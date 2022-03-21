import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/rxc-voice-beta-logo.png";

import "./Header.scss";

function Header() {

  return (
    <div className="App-header">
      <Link
      to={`/`}
      className="app-title"
      >
        <img src={logo} className="App-logo" alt="logo" />
      </Link>
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
        to={`/manage-events`}
        className="nav-link"
        >
        Admin
        </Link>
        <Link
        to={`/account`}
        className="nav-link"
        >
        Account
        </Link>
        <Link
        to={`/help`}
        className="nav-link"
        >
        Help
        </Link>
      </ul>
    </div>
  );
}

export default Header;
