import React, { useEffect } from "react";
import { BgColor } from "../../models/BgColor";

import "./Account.scss";

function Account(props: any) {

  useEffect(() => {
    props.changeColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    sessionStorage.setItem("user", "");
    props.setUser(() => "");
  };

  return (
    <div className="account">
      <button
        type="button"
        className="logout-button"
        onClick={() => logout()}
        >
        log out
      </button>
    </div>
  );
}

export default Account;
