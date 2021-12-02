import React, { useContext } from "react";
import { StateContext } from "../../../../../hooks";

import "./DelegateCard/DelegateCard.scss";

function ProfileIcon() {
  const { color } = useContext(StateContext);

  return (
    <svg className="profile-pic" width="119" height="119" viewBox="0 0 119 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="59" cy="59" r="59" fill="black"/>
      <circle cx="59" cy="59" r="50" fill={color}/>
      <rect x="17" y="21" width="84" height="76" fill="black"/>
      <rect x="22" y="42" width="12" height="61" fill="black"/>
      <rect x="8" y="30" width="12" height="58" fill="black"/>
      <rect x="97" y="30" width="13" height="58" fill="black"/>
      <rect x="26" y="23" width="12" height="66" transform="rotate(-90 26 23)" fill="black"/>
      <rect x="37" y="17" width="10" height="42" transform="rotate(-90 37 17)" fill="black"/>
      <rect x="83" y="45" width="12" height="61" fill="black"/>
      <ellipse cx="58.5" cy="78.5" rx="24.5" ry="23.5" fill={color}/>
      <circle cx="59" cy="42" r="20" fill="black"/>
      <circle cx="59" cy="42" r="16" fill={color}/>
      <rect x="34" y="78" width="9" height="20" fill={color}/>
      <rect x="74" y="78" width="9" height="20" fill={color}/>
      <rect x="43" y="98" width="16" height="31" transform="rotate(-90 43 98)" fill={color}/>
    </svg>
  );
}

export default ProfileIcon;
