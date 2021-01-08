import React, { useContext, useEffect } from "react";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";

import "./About.scss";

function About() {
  const { setColor } = useContext(ActionContext);

  useEffect(() => {
    setColor(BgColor.Yellow);

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="about">
      <h1 className="title">About</h1>
      <p className="about-text">Welcome to RxC Voice, RadicalxChange's first
        online platform for collective decision making!
      </p>
    </div>
  );
}

export default About;
