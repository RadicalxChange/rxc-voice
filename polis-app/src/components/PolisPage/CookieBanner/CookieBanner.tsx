import React, { useState } from "react";
import publicIp from "public-ip";
import { fromString } from "uuidv4";
import moment from "moment";
import { useParams } from "react-router-dom";
import { PolisPageRouteParams } from "../../../models/PolisPageRouteParams";

import "./CookieBanner.scss";

function CookieBanner(props:any) {
  const { conversationId } = useParams<PolisPageRouteParams>();
  const [showCookieBanner, setShowCookieBanner] = useState(!!!props.thisCookie);
  const [showPolicy, setShowPolicy] = useState(true);

  const allowCookies = () => {
   (async () => {
       const userIp = await publicIp.v6();
       props.setCookie(conversationId, fromString(moment().toDate() + userIp + conversationId), {
         path: "/",
         expires: moment().add(1, "days").toDate(),
         sameSite: "lax",
       });
       setShowCookieBanner(showCookieBanner => false);
       props.setCanVote((canVote: boolean) => true);
     }
   )();
  };

  return (
    <div className={`cookie-banner ${!showCookieBanner ? "closed" : ""}`}>
      <div className={`cookie-policy ${!showPolicy ? "closed" : ""}`}>
      </div>
        {showPolicy ? (
          <span className="policy-long">
            Welcome! With your consent, we would like to use a cookie to
            identify you as a distinct voter. If you accept, we will store a
            random number on your device that tells us you've been here before.
            This prevents double-voting. We do not store any information about
            you or your device. If you decline, you won't be able to vote (you
            can still post comments). Thanks for joining the conversation!
          </span>
        ) : (
          <span className="policy-short">
            Please allow cookies if you would like to vote.
          </span>
        )}
        {showPolicy ? (
          <button
            type="button"
            className="show-less"
            onClick={() => setShowPolicy(showPolicy => false)}
          >
          Show less
          </button>
        ) : (
          <button
            type="button"
            className="show-more"
            onClick={() => setShowPolicy(showPolicy => true)}
          >
          Show more
          </button>
        )}
      <div className="options">
        <button
          type="button"
          className="decline-button"
          onClick={() => setShowCookieBanner(showCookieBanner => false)}
        >
        Decline
        </button>
        <button
          type="button"
          className="accept-button"
          onClick={() => allowCookies()}
        >
        Accept
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;
