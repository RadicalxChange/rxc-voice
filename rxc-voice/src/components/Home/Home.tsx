import React, { useEffect, useState } from "react";
import moment from "moment";
// import { Link } from "react-router-dom";
import { BgColor } from "../../models/BgColor";
import { Process } from "../../models/Process";
import { WebService } from "../../services";
import ProcessCard from "./components/ProcessCard";

import "./Home.scss";

function Home(props: any) {
  const [activeProcesses, setActiveProcesses] = useState(new Array<Process>());
  const [pastProcesses, setPastProcesses] = useState(new Array<Process>());

  useEffect(() => {
    props.changeColor(BgColor.Yellow);

    WebService.fetchProcesses().subscribe((data: Process[]) => {
      data.forEach((process: Process) => {
        if (moment(process.end_date) > moment()) {
          setActiveProcesses(activeProcesses => [...activeProcesses, process]);
        } else {
          setPastProcesses(pastProcesses => [...pastProcesses, process]);
        }
      });
    });

   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <h1>Active</h1>
        {activeProcesses.length ? (
          <ul>
            {activeProcesses.map((process: Process) => (
              <ProcessCard process={process} key={process.id} />
            ))}
          </ul>
        ) : (
          <h3>None</h3>
        )}
      <h1>Archived</h1>
        {pastProcesses.length ? (
          <ul>
            {pastProcesses.map((process: Process) => (
              <ProcessCard process={process} key={process.id} />
            ))}
          </ul>
        ) : (
          <h3>None</h3>
        )}
    </div>
  );
}

export default Home;
