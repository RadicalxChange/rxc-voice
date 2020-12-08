import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

import "./Header.scss";

function Header(props: any) {

if (props.color === "yellow") {
  return (
    <div className="App-header-yellow">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
} else {
  return (
    <div className="App-header-white">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  )
}
}

export default Header;
