import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

import "./Header.scss";

function Header() {

  return (
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
}

export default Header;
