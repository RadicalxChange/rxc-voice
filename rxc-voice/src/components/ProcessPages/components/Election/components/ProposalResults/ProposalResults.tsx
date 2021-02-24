import React from "react";
import { Proposal } from "../../../../../../models/Proposal";

import "./ProposalResults.scss";

function ProposalResults(props: any) {
  const barHeight = (window.innerWidth > 768) ? 18 : 12;
  const graphMaxWidth = (window.innerWidth > 768) ? 400 : 100;
  const titlesWidth = (window.innerWidth > 768) ? 200 : 100;
  const numbersWidth = 100;
  const graphSpan = Math.abs(props.lowestProposal) + Number(props.highestProposal);
  const gutterHeight = barHeight
  const graphHeight = (barHeight + gutterHeight) * props.proposals.length
  const yAxis = (props.lowestProposal < 0) ? (
    (Math.abs(props.lowestProposal) / graphSpan) * graphMaxWidth + titlesWidth + 1
  ) : (
    titlesWidth + 1
  );

  return (
    <div className="results">
      <svg className="graph" width={`${titlesWidth + graphMaxWidth + numbersWidth}`} height={`${graphHeight}`} xmlns="http://www.w3.org/2000/svg">
        <line x1={`${yAxis}`} y1="0" x2={`${yAxis}`} y2={`${graphHeight}`} stroke="black" strokeWidth="1" />
        {props.proposals.map((proposal: Proposal, i) => (
          <><text
            className="proposal-title"
            x="0"
            y={`${i * (barHeight + gutterHeight) + (barHeight + gutterHeight / 2 - 3)}`}
            fill="black"
            width={`${titlesWidth}`}

          >
            {proposal.title}
          </text>
          <rect
            className="bar"
            x={`${(proposal.votes_received < 0) ? (
              yAxis - (Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth
            ) : (
              yAxis
            )}`}
            y={`${i * (barHeight + gutterHeight) + (gutterHeight / 2)}`}
            width={`${(Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth}`}
            height={`${barHeight}`}
            fill="black"
            >
            </rect>
            <text
              x={`${(proposal.votes_received > 0) ? (
                (Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth + yAxis + 5
              ) : (
                  yAxis + 5
                )}`}
              y={`${i * (barHeight + gutterHeight) + (barHeight + gutterHeight / 2 - 3)}`}
              fill="black"
            >
              {proposal.votes_received}
            </text></>
        ))}
      </svg>
    </div>
  );
}

export default ProposalResults;
