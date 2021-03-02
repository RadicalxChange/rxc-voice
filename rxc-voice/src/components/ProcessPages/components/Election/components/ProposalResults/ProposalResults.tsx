import React, { useRef, useEffect } from 'react';
import { Proposal } from '../../../../../../models/Proposal';

import "./ProposalResults.scss";

function ProposalResults(props: any) {
  const barHeight = (window.innerWidth > 768) ? 18 : 12;
  const gutterHeight = barHeight * 1.5
  const proposals = props.resultData.proposals.sort((a: Proposal, b: Proposal) => {
      return Number(b.votes_received) - Number(a.votes_received);
    });;
  const highestProposal = props.resultData.highestProposal;
  const lowestProposal = props.resultData.lowestProposal;
  const graphHeight = (barHeight + gutterHeight) * proposals.length + 10
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = Math.min(700, window.innerWidth - 40);

  useEffect(() => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // determine width of labels, set dimensions accordingly
          var longestLine = 0;
          proposals.forEach((proposal:Proposal, i) => {
            const lineWidth = ctx.measureText(proposal.title).width;
            if (lineWidth > longestLine) {
              longestLine = lineWidth;
            }
          });
          const titlesWidth = Math.min(canvasWidth * 0.42, longestLine + 5);
          const graphMaxWidth = canvasWidth - 30 - titlesWidth;
          const graphSpan = Math.abs(lowestProposal) + Number(highestProposal);
          const yAxis = (lowestProposal < 0) ? (
            (Math.abs(lowestProposal) / graphSpan) * graphMaxWidth + titlesWidth + 1
          ) : (
            titlesWidth + 1
          );
          // draw graph
          ctx.fillStyle = "black";
          ctx.font = '12px suisse_intlbook';
          ctx.moveTo(yAxis, 0);
          ctx.lineTo(yAxis, graphHeight);
          ctx.stroke();
          proposals.forEach((proposal:Proposal, i) => {
            // draw bar
            const x = (proposal.votes_received < 0) ? (
              yAxis - (Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth
            ) : (
              yAxis
            );
            const y = i * (barHeight + gutterHeight) + (gutterHeight / 2) + 5;
            const barWidth = (Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth;
            ctx.fillRect(x, y, barWidth, barHeight);
            // draw proposal title
            const lines = wrapText(ctx, proposal.title, titlesWidth - 5);
            const offset = (lines.length - 1) * 6;
            lines.forEach((line:string, i) => {
              ctx.fillText(line, 0, y + barHeight * .8 - offset + 12 * i);
            })
            // draw proposal vote count
            ctx.fillText(String(proposal.votes_received), x + barWidth + 5, y + barHeight * .8);
          })
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.resultData]);

  const wrapText = (context, text, maxWidth): string[] => {
    var words = text.split(' ');
    var nextLine = '';
    var lines: string[] = []

    for(var n = 0; n < words.length; n++) {
      var testLine = nextLine + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(nextLine);
        nextLine = words[n] + ' ';
      }
      else {
        nextLine = testLine;
      }
    }
    lines.push(nextLine);
    return lines;
  }

  return (
    <canvas className="graph" ref={canvasRef} height={graphHeight} width={canvasWidth} />
  );
};

export default ProposalResults;
