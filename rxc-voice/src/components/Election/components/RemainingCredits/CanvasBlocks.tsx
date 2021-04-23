import React, { useRef, useEffect } from 'react';

import "./CanvasBlocks.scss";

function CanvasBlocks(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stackGutter = 3;
  const numStacks = Math.ceil(props.creditBalance / 25)

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

  useEffect(() => {
    draw()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.creditBalance, props.creditsRemaining]);

  // make canvas responsive
  window.addEventListener('resize', () => {
    draw()
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
    const [nrows, ncols, stack_size] = optimizeStackHeight(canvas);
    const stackHeight = +stack_size - (2 * stackGutter);
    const widthPixels = ncols * stackHeight;
    const padding = ((canvas.width - widthPixels) / 2) - stackGutter;
    const cellHeight = stackHeight / 5;
    const gutterHeight = 0.3 * cellHeight;
    const blockHeight = cellHeight - gutterHeight;
    ctx.fillStyle = "black";
    let counter = 0;
    for (let j = 0; j < (5 * nrows); j++) {
      for (let i = 0; i < (5 * ncols) && counter < props.creditBalance; i++) {
        // ctx.fillStyle = (counter < props.creditsRemaining) ? "black" : "none";
        const x = padding + (blockHeight + gutterHeight) * i + stackGutter * Math.floor(i / 5);
        const y = canvas.height - ((blockHeight + gutterHeight) * j + stackGutter * Math.floor(counter / (25 * ncols)) + gutterHeight + blockHeight);
        if (counter < props.creditsRemaining) {
          ctx.fillRect(x, y, blockHeight, blockHeight);
        } else {
          ctx.clearRect(x, y, blockHeight, blockHeight);
        }
        counter++;
      }
    }
  };

  const optimizeStackHeight = (canvas: HTMLCanvasElement): [number, number, number] => {
    // Compute number of rows and columns, and cell size
    var ratio = canvas.width / canvas.height;
    var ncols_float = Math.sqrt(numStacks * ratio);
    var nrows_float = numStacks / ncols_float;

    // Find best option filling the whole height
    var nrows1 = Math.ceil(nrows_float);
    var ncols1 = Math.ceil(numStacks / nrows1);
    while (nrows1 * ratio < ncols1) {
        nrows1++;
        ncols1 = Math.ceil(numStacks / nrows1);
    }
    var cell_size1 = canvas.height / nrows1;

    // Find best option filling the whole width
    var ncols2 = Math.ceil(ncols_float);
    var nrows2 = Math.ceil(numStacks / ncols2);
    while (ncols2 < nrows2 * ratio) {
        ncols2++;
        nrows2 = Math.ceil(numStacks / ncols2);
    }
    var cell_size2 = canvas.width / ncols2;

    // Find the best values
    var nrows, ncols, cell_size;
    if (cell_size1 < cell_size2) {
        nrows = nrows2;
        ncols = ncols2;
        cell_size = cell_size2;
    } else {
        nrows = nrows1;
        ncols = ncols1;
        cell_size = cell_size1;
    }
    return [nrows, ncols, cell_size];
  }

  return (
    <canvas id="responsive-graph" ref={canvasRef} />
  );
};

export default CanvasBlocks;
