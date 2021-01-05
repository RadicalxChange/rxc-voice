import React, { useContext, useEffect } from "react";
import { ActionContext, StateContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./Account.scss";

function Account() {
  const { setColor, logoutUser } = useContext(ActionContext);
  const { user } = useContext(StateContext);
  console.log("account" + user);

  useEffect(() => {
    setColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="account">
      <button
        type="button"
        className="logout-button"
        onClick={() => logoutUser()}
        >
        log out
      </button>
    </div>
  );
}

export default Account;
