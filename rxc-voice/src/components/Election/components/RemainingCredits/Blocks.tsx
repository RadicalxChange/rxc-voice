import React from "react";

function Blocks(props: any) {
  const blockHeight = (window.innerWidth > 768) ? .6 : 1.2;
  const gutterHeight = (window.innerWidth > 768) ? .3 : .7;
  const stackHeightBlocks = 5
  const stackHeightPixels = stackHeightBlocks * (blockHeight + gutterHeight)
  const numRows = Math.ceil(props.creditBalance / 10)
  // start a new row every 10 blocks
  var maxHeight = 2 * stackHeightPixels + gutterHeight;
  var maxWidth = numRows * (blockHeight + gutterHeight) + Math.floor(props.creditBalance / 50) * gutterHeight;
  if (window.innerWidth > 768) {
    const temp = maxHeight;
    maxHeight = maxWidth;
    maxWidth = temp;
  }

  const renderBlocks = () => {
    let blocks: JSX.Element[] = [];
    let counter = 0;
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < 10 && counter < props.creditBalance; x++) {
        const fill = (counter < props.creditsRemaining) ? "black" : "none"
        blocks.push(
          <rect
            key={`${counter}`}
            x={`${(blockHeight + gutterHeight) * x + Math.floor(x / 5) * gutterHeight}vw`}
            y={`${maxHeight - ((blockHeight + gutterHeight) * y + Math.floor(counter / 50) * gutterHeight + gutterHeight + blockHeight)}vw`}
            width={`${blockHeight}vw`}
            height={`${blockHeight}vw`}
            fill={`${fill}`}
          />
        );
        counter++;
      }
    }
    return blocks;
  };

  const renderBlocksMobile = () => {
    let blocks: JSX.Element[] = [];
    let counter = 0;
    for (let x = 0; x < numRows; x++) {
      for (let y = 0; y < 10 && counter < props.creditBalance; y++) {
        const fill = (counter < props.creditsRemaining) ? "black" : "none"
        blocks.push(
          <rect
            key={`${counter}`}
            x={`${(blockHeight + gutterHeight) * x + Math.floor(counter / 50) * gutterHeight + gutterHeight}vw`}
            y={`${(blockHeight + gutterHeight) * y + Math.floor(y / 5) * gutterHeight + gutterHeight / 2}vw`}
            width={`${blockHeight}vw`}
            height={`${blockHeight}vw`}
            fill={`${fill}`}
          />
        );
        counter++;
      }
    }
    return blocks;
  };

  const blocks = (window.innerWidth > 768) ? renderBlocks() : renderBlocksMobile();

  return (
    <svg
      className="blocks"
      width={`${maxWidth}vw`}
      height={`${maxHeight}vw`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {blocks}
    </svg>
  );
}

export default Blocks;
