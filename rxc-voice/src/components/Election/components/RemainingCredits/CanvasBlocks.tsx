import React, { useRef, useEffect } from 'react';

import "./CanvasBlocks.scss";

function CanvasBlocks(props: any) {
  // const blockHeight = (window.innerWidth > 768) ? 18 : 12;
  // const gutterHeight = (window.innerWidth > 768) ? 9 : 6;
  const numRows = Math.ceil(props.creditBalance / 10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stackGutter = 3;
  const numStacks = Math.ceil(props.creditBalance / 25)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // draw initial graph
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setUpCanvas(canvas, ctx);
        drawGraph(canvas, ctx);
      }
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.creditBalance, props.creditsRemaining]);

  // make canvas responsive
  window.addEventListener('resize', () => {
    redraw()
  });

  // set up canvas dimensions
  const setUpCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // TODO: width and height based on props.creditBalance
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var w = canvas.width, h = canvas.height;

    // scale the canvas by window.devicePixelRatio
    canvas.width = w*window.devicePixelRatio;
    canvas.height = h*window.devicePixelRatio;

    // set the scale of the context
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  // draw
  const drawGraph = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const stackHeight = Math.min((canvas.height / (numStacks / 2)), canvas.width / 2) - stackGutter;
    const widthStacks = Math.floor(canvas.width / (stackHeight + stackGutter));
    const widthPixels = widthStacks * stackHeight;
    const padding = ((canvas.width - widthPixels) / 2) - stackGutter;
    const cellHeight = stackHeight / 5;
    const gutterHeight = 0.3 * cellHeight;
    const blockHeight = cellHeight - gutterHeight;
    ctx.fillStyle = "black";
    let counter = 0;
    for (let j = 0; j < numRows; j++) {
      for (let i = 0; i < (5 * widthStacks) && counter < props.creditBalance; i++) {
        // ctx.fillStyle = (counter < props.creditsRemaining) ? "black" : "none";
        const x = padding + (blockHeight + gutterHeight) * i + stackGutter * Math.floor(i / 5);
        const y = canvas.height - ((blockHeight + gutterHeight) * j + stackGutter * Math.floor(counter / (25 * widthStacks)) + gutterHeight + blockHeight);
        if (counter < props.creditsRemaining) {
          ctx.fillRect(x, y, blockHeight, blockHeight);
        } else {
          ctx.clearRect(x, y, blockHeight, blockHeight);
        }
        counter++;
      }
    }
  };

  const redraw = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setUpCanvas(canvas, ctx);
        drawGraph(canvas, ctx);
      }
    }
  };

  return (
    <canvas id="responsive-graph" ref={canvasRef} />
  );
};

export default CanvasBlocks;
