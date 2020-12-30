import React from "react";
import { WebService } from "../../services";

import "./ValidationPage.scss";

function ValidationPage() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [number, setNumber] = useState("");

    const modify = () => {
      if (password && username) {
        WebService.modifyUser({
          user: {
            username: username,
            password: password,
          },
          profile_pic: profilePic,
          phone_number: number
          },
          ).subscribe(async (data) => {
          if (data.ok) {
            const user = await data.json();
            sessionStorage.setItem("user", JSON.stringify(user));
            props.setUser(() => user);
            console.log(user);
          } else {
            const error = await data.json();
            console.log(error);
          }
        });
      }
    };

    return (
        <div className="validation-page"> // redirect to login if no user token

        </div>
    );
}

export default ValidationPage;
