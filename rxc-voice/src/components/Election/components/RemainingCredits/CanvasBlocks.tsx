import React, { useRef, useEffect } from 'react';

import "./CanvasBlocks.scss";

function CanvasBlocks(props: any) {
  const blockHeight = (window.innerWidth > 768) ? 18 : 12;
  const gutterHeight = (window.innerWidth > 768) ? 9 : 6;
  const numRows = Math.ceil(props.creditBalance / 10);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // make canvas responsive
  window.addEventListener('resize', () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setUpCanvas(canvas, ctx);
        drawGraph(canvas, ctx);
      }
    }
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
    ctx.fillStyle = "black";
    let counter = 0;
    for (let j = 0; j < numRows; j++) {
      for (let i = 0; i < 10 && counter < props.creditBalance; i++) {
        const fill = (counter < props.creditsRemaining) ? "black" : "none"
        const x = (blockHeight + gutterHeight) * i + Math.floor(i / 5) * gutterHeight;
        const y = canvas.height - ((blockHeight + gutterHeight) * j + Math.floor(counter / 50) * gutterHeight + gutterHeight + blockHeight);
        ctx.fillRect(x, y, blockHeight, blockHeight);
        counter++;
      }
    }
  };

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
  },[props.creditBalance]);

  return (
    <canvas id="responsive-graph" ref={canvasRef} />
  );
};

export default CanvasBlocks;
