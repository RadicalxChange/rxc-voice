import React, { useEffect, useRef } from "react";

function ProposalBlocks(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalHeightBlocks = Math.sqrt(props.cost)

  useEffect(() => {
    draw()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.cost]);

  // make canvas responsive
  window.addEventListener('resize', () => {
    draw()
  });

  const draw = () => {
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

  // set up canvas dimensions
  const setUpCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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
    const cellHeight = Math.min(canvas.height / totalHeightBlocks, 10);
    const blockHeight = cellHeight * .8;
    const gutter = cellHeight - blockHeight;
    const padding = (canvas.height - cellHeight*totalHeightBlocks) / 2
    for (let j = 0; j < totalHeightBlocks; j++) {
      for (let i = 0; i < totalHeightBlocks; i++) {
        const x = padding + (blockHeight + gutter) * i;
        const y = padding + (blockHeight + gutter) * j;
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, blockHeight, blockHeight);
      }
    }
  };

  return (
    <canvas id="proposal-blocks" ref={canvasRef} />
  );
}

export default ProposalBlocks;
