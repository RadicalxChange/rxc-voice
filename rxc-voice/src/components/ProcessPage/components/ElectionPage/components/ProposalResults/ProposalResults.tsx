import React, { useRef, useEffect, useState } from 'react';
import { Proposal } from '../../../../../../models/Proposal';

import "./ProposalResults.scss";

function ProposalResults(props: any) {
  const barHeight = (window.innerWidth > 768) ? 18 : 12;
  const proposals = props.resultData.proposals.sort((a: Proposal, b: Proposal) => {
    return Number(b.votes_received) - Number(a.votes_received);
  });
  const highestProposal = props.resultData.highestProposal;
  const lowestProposal = props.resultData.lowestProposal;
  const [longestLine, setLongestLine] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // make canvas responsive
  window.addEventListener('resize', () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const length = ctx.measureText(longestLine).width;
        const numWraps = wrapText(ctx, longestLine, Math.min(canvas.width * 0.42, length + 5) - 5).length
        const newGutterHeight = 15 + Math.max(0, numWraps - 1) * 8;
        setUpCanvas(canvas, newGutterHeight);
        drawGraph(canvas, ctx, length, newGutterHeight);
      }
    }
  });

  // set up canvas dimensions
  const setUpCanvas = (canvas: HTMLCanvasElement, newGutterHeight: number) => {
    canvas.width = canvas.clientWidth;
    canvas.height = (barHeight + newGutterHeight) * proposals.length + 10;
    var w = canvas.width;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // set the scale of the context
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // scale the canvas by window.devicePixelRatio
    canvas.width = w*window.devicePixelRatio;
    // canvas.height = h*window.devicePixelRatio;
  };

  // draw
  const drawGraph = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, longLine: number, newGutterHeight: number) => {
    const titlesWidth = Math.min(canvas.width * 0.42, longLine + 5);
    const graphMaxWidth = canvas.width - 30 - titlesWidth;
    const graphSpan = Math.abs(lowestProposal) + Number(highestProposal);
    const yAxis = (lowestProposal < 0) ? (
      (Math.abs(lowestProposal) / graphSpan) * graphMaxWidth + titlesWidth + 1
    ) : (
      titlesWidth + 1
    );
    ctx.fillStyle = "black";
    ctx.font = '12px suisse_intlbook';
    ctx.moveTo(yAxis, 0);
    ctx.lineTo(yAxis, canvas.height);
    ctx.stroke();
    proposals.forEach((proposal:Proposal, i) => {
      // draw bar
      const x = (proposal.votes_received < 0) ? (
        yAxis - (Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth
      ) : (
        yAxis
      );
      const y = i * (barHeight + newGutterHeight) + (newGutterHeight / 2) + 5;
      const barWidth = (Math.abs(proposal.votes_received) / graphSpan) * graphMaxWidth;
      ctx.fillRect(x, y, barWidth, barHeight);
      // draw proposal title
      const lines = wrapText(ctx, proposal.title, titlesWidth - 5);
      const offset = (lines.length - 1) * 6;
      lines.forEach((line:string, j) => {
        ctx.fillText(line, 0, y + barHeight * .8 - offset + 12 * j);
      })
      // draw proposal vote count
      ctx.fillText(String(proposal.votes_received), x + barWidth + 5, y + barHeight * .8);
    })
  };

  // when new proposal data is loaded, update longestLine and draw
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // determine longest proposal title, set dimensions to fit it
        var long = 0;
        var line = '';
        proposals.forEach((proposal:Proposal, i) => {
          const lineWidth = ctx.measureText(proposal.title).width;
          if (lineWidth > long) {
            long = lineWidth;
            line = proposal.title;
          }
        });
        setLongestLine(line);
        const numWraps = wrapText(ctx, line, Math.min(canvas.width * 0.42, long + 5) - 5).length
        const newGutterHeight = 15 + Math.max(0, numWraps - 1) * 8;
        // draw initial graph
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setUpCanvas(canvas, newGutterHeight);
        drawGraph(canvas, ctx, long, newGutterHeight);
      }
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.resultData]);

  // wrap long proposal titles
  const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
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
    <canvas id="responsive-graph" ref={canvasRef} />
  );
};

export default ProposalResults;
