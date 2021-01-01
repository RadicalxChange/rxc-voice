import React, { useContext, useEffect } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./Account.scss";

function Account() {
  const { setColor, logoutUser } = useContext(ActionContext);

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
