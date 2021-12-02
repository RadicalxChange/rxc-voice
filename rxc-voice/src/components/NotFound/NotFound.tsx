import React from "react";

import "./NotFound.scss";

function NotFound() {

  return (
    <div className="not-found">
      <h1 className="title">
        Page Not Found
      </h1>
      <a className="home-button" href="/">Back to RxC Voice</a>
    </div>
  );
}

export default NotFound;
