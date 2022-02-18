import React, { useContext, useEffect } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./Help.scss";

function Help() {
  const { setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="help">
      <h1 className="title">Help</h1>
      <p>Is something not working the way you expect it to? Do you think you may have encountered a bug? Choose one of the options below to help us improve this app and resolve your issue.</p>
      <ul className="bullets help-options">
        <li>
          <a
            href="https://github.com/RadicalxChange/rxc-voice/issues/new/choose"
            target="_blank"
            rel="noopener nofollow noreferrer"
            className="inline-link"
          >
            Open an issue on Github
          </a>
        </li>
        <li>
          <a
            href="https://discord.gg/AvBQh3UwvJ"
            target="_blank"
            rel="noopener nofollow noreferrer"
            className="inline-link"
          >
            Ask a question on Discord
          </a>
        </li>
        <li>
          <a
            href="mailto:voice@radicalxchange.org?subject=RxC%20Voice%20Help"
            target="_blank"
            rel="noopener nofollow noreferrer"
            className="inline-link"
          >
            Email us
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Help;
