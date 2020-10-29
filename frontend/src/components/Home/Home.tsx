import React from "react";
import { Link } from "react-router-dom";

import "./Home.scss";

function Home() {

  return (
    <div className="home">
        <h1>RxC QV</h1>
        <p>Welcome to RadicalxChange's Quadratic Voting tool!</p>
        <p>Click below to create a QV election.</p>
        <Link
          to='/create-election'
        >
          <div className="create-election-button">
            <div className="button-text">create election</div>
          </div>
        </Link>

    </div>
  );
}

export default Home;
