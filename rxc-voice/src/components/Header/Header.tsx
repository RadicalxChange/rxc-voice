import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ActionContext, StateContext } from "../../hooks";
import { WebService } from "../../services";

import "./Header.scss";

function Header() {
  const { creditBalance } = useContext(StateContext);
  const { updateCreditBalance } = useContext(ActionContext);

  useEffect(() => {
    if (creditBalance === null) {
      const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null
      if (user) {
        WebService.getDelegate(user.id).subscribe(async (data: any) => {
          if (data.ok) {
            const delegate = await data.json();
            updateCreditBalance(delegate.credit_balance);
          }
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App-header">
      <a
      href='https://voice.radicalxchange.org'
      className="app-title"
      >
        RxC VOICE
      </a>
      <ul className="nav">
        <a
        href='https://radicalxchange.org'
        className="nav-link"
        >
        RadicalxChange
        </a>
        <Link
        to={`/account`}
        className="nav-link"
        >
        Account
        </Link>
        <h2 className="credit-balance">Credit Balance: {creditBalance}</h2>
      </ul>
    </div>
  );
}

export default Header;
