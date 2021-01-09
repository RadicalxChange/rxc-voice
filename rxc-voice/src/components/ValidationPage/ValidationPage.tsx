import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { uuid } from 'uuidv4';
import { WebService } from "../../services";

import "./ValidationPage.scss";

function ValidationPage() {
    // const [password, setPassword] = useState("");
    // const [username, setUsername] = useState("");
    // const [profilePic, setProfilePic] = useState("");
    // const [number, setNumber] = useState("");
    const location = useLocation();
    const code = new URLSearchParams(location.search).get('code');
    const state = new URLSearchParams(location.search).get('state');
    console.log(code);
    console.log(state);
    console.log(WebService.githubState);


    useEffect(() => {
      if (!code || (state !== WebService.githubState)) {
        WebService.getGithubCreds().subscribe(async (data) => {
          if (data.github_client_id && data.github_client_secret) {
            const stateUUID = uuid();
            sessionStorage.setItem("githubState", stateUUID);
            window.location.href =
              'https://github.com/login/oauth/authorize?client_id='
              + data.github_client_id +
              '&redirect_uri=http://localhost:3000/verify&state=' + stateUUID;
          } else {
            console.log("could not retrieve github credentials from server.");
          }
        });
      } else {
        console.log("all set to get an access token");
        WebService.getGithubCreds().subscribe(async (data) => {
          if (data.github_client_id && data.github_client_secret) {
            const params: any = [
              { key: 'client_id', value: data.github_client_id },
              { key: 'client_secret', value: data.github_client_secret },
              { key: 'code', value: code },
              { key: 'redirect_uri', value: 'http://localhost:3000/verify' },
              { key: 'state', value: state },
            ]

            WebService.getGithubToken(params).subscribe(async (data) => {
              if (data.ok) {
                console.log("got the token");
                console.log(data);
              } else {
                const error = await data.json();
                console.log(error);
              }
            });
            // params.forEach((param: any) => {
            //   var field = document.createElement('input');
            //   field.setAttribute('type', 'hidden');
            //   field.setAttribute('name', param.key);
            //   field.setAttribute('value', param.value);
            //
            //   form.appendChild(field);
            // });
            // var form = document.createElement('form');
            // form.setAttribute('method', 'POST');
            // form.setAttribute('action', 'https://github.com/login/oauth/access_token');
            //
            //
            //
            // document.body.appendChild(form);
            // form.submit();

          } else {
            console.log("could not retrieve github credentials from server. submit code with form");
          }
        })
      }

     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

    // const modify = () => {
    //   if (password && username) {
    //     WebService.modifyUser({
    //       user: {
    //         username: username,
    //         password: password,
    //       },
    //       profile_pic: profilePic,
    //       phone_number: number
    //     }, WebService.userobj.id).subscribe(async (data) => {
    //       if (data.ok) {
    //         const user = await data.json();
    //         console.log(user);
    //       } else {
    //         const error = await data.json();
    //         console.log(error);
    //       }
    //     });
    //   }
    // };

    return (
        <div className="validation-page"> {// redirect to login if no user token
        }
          <h2>Verify</h2>
        </div>
    );
}

export default ValidationPage;
