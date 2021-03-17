import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ActionContext, StateContext } from "../../hooks";
import { WebService } from "../../services";
import { Domain, verifyUser } from "../../utils";

import "./Callback.scss";

function Callback() {
    const location = useLocation();
    const github_code = new URLSearchParams(location.search).get('code');
    const github_state = new URLSearchParams(location.search).get('state');
    const twitter_token = new URLSearchParams(location.search).get('oauth_token');
    const twitter_verifier = new URLSearchParams(location.search).get('oauth_verifier');
    const error_msg = new URLSearchParams(location.search).get('error');
    const error_description = new URLSearchParams(location.search).get('error_description');
    const { user } = useContext(StateContext);
    const { setUserData } = useContext(ActionContext);
    const [accessDenied, setAccessDenied] = useState(false);


    useEffect(() => {
      if (!github_code) {
        if (!twitter_token) {
          console.error("Access Denied: user did not grant RxC Voice permission to access their Twitter account.");
          setAccessDenied(true);
        } else if (twitter_token !== WebService.oauthState) {
          if (error_msg && error_description) {
            console.error(error_msg + ": " + error_description);
          } else {
            console.error("Access Denied: Twitter token is invalid.");
          }
          setAccessDenied(true);
        } else {
          const params: any = {
            oauth_token: twitter_token,
            oauth_verifier: twitter_verifier,
            oauth_secret: WebService.twitterOauthSecret,
           }
          WebService.getTwitterAccessToken(params).subscribe(async (data) => {
            if (data.ok) {
              console.log("got the token");
              setUserData(verifyUser(user));
              window.location.href = Domain.WEB;
            } else {
              setAccessDenied(true);
            }
          });
        }
      } else {
        if (github_state !== WebService.oauthState) {
          console.error("Access Denied: Github token is invalid.");
          setAccessDenied(true);
        } else {
          const params: any = { code: github_code, state: github_state, }
          WebService.verifyGithub(params).subscribe(async (data) => {
            if (data.ok) {
              console.log("got the token");
              setUserData(verifyUser(user));
              window.location.href = Domain.WEB;
            } else {
              const error = await data.json();
              console.error(error);
              setAccessDenied(true);
            }
          });
        }
      }

     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

    return (
        <div className="validation-page">
          {accessDenied ? (
            <>
            <h2>Access Denied.</h2>
            <p>Either you denied RxC Voice access to your Github or Twitter account, or this link may be broken or expired.</p>
            </>
          ) : (
            <h2>verifying your account...</h2>
          )}
        </div>
    );
}

export default Callback;
