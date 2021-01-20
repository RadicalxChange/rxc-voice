import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { useLocation } from "react-router";
import { WebService } from "../../services";

import "./Callback.scss";

function Callback() {
    const location = useLocation();
    const code = new URLSearchParams(location.search).get('code');
    const state = new URLSearchParams(location.search).get('state');

    const alert = useAlert()


    useEffect(() => {
      if (!code) {
        alert.error("Access denied. This link may be broken or expired.")
      } else {
        if (state !== WebService.githubState) {
          alert.error("Access denied. This link may be broken or expired.")
        } else {
          const params: any = { code: code, state: state, }
          WebService.getGithubToken(params).subscribe(async (data) => {
            if (data.ok) {
              console.log("got the token");
              const githubToken = await data.json();
              console.log(githubToken);
              WebService.verifyGithub(githubToken).subscribe(async (data) => {
                if (data.ok) {
                  console.log("verified");
                  const githubData = await data.json();
                  console.log(githubData);
                  window.location.href = 'http://localhost:3000'
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
