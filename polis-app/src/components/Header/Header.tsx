import React from "react";
import logo from '../../assets/logo.svg';

import "./Header.scss";

function Header() {

  return (
    <header className="App-header">
      <img src={logo} className="logo" />
    </header>
  );
}

export default Header;
