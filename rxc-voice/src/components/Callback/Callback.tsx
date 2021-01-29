import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { useLocation } from "react-router";
import { WebService } from "../../services";

import "./Callback.scss";

function Callback() {
    const location = useLocation();
    const github_code = new URLSearchParams(location.search).get('code');
    const github_state = new URLSearchParams(location.search).get('state');
    const twitter_token = new URLSearchParams(location.search).get('oauth_token');
    const twitter_verifier = new URLSearchParams(location.search).get('oauth_verifier');

    const alert = useAlert()


    useEffect(() => {
      if (!github_code) {
        if (!twitter_token) {
          alert.error("Access denied. This link may be broken or expired.");
        } else {
          if (twitter_token !== WebService.oauthState) {
            alert.error("Access denied. This link may be broken or expired.");
          } else {
            const params: any = {
              oauth_token: twitter_token,
              oauth_verifier: twitter_verifier,
              oauth_secret: WebService.twitterOauthSecret,
             }
            WebService.getTwitterAccessToken(params).subscribe(async (data) => {
              if (data.ok) {
                const twitterToken = await data.json();
                window.location.href = 'https://voice.radicalxchange.org';
              }
            });
          }
        }
      } else {
        if (github_state !== WebService.oauthState) {
          alert.error("Access denied. This link may be broken or expired.");
        } else {
          const params: any = { code: github_code, state: github_state, }
          WebService.getGithubToken(params).subscribe(async (data) => {
            if (data.ok) {
              const githubToken = await data.json();
              WebService.verifyGithub(githubToken).subscribe(async (data) => {
                if (data.ok) {
                  const githubData = await data.json();
                  window.location.href = 'https://voice.radicalxchange.org';
                }
              })
            } else {
              const error = await data.json();
              console.log(error);
            }
          });
        }
      }

     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

    return (
        <div className="validation-page"> {// redirect to login if no user token
        }
          <h2>verifying your account...</h2>
        </div>
    );
}

export default Callback;
