import React from "react";

function Blocks(props: any) {
  const strokeWidth = (window.innerWidth > 768) ? .15 : .5;
  const blockHeight = ((window.innerWidth > 768) ? 1 : 2.5) + strokeWidth;
  const gutterHeight = (window.innerWidth > 768) ? .4 : 1.5;
  const stackHeightBlocks = 5
  const stackHeightPixels = stackHeightBlocks * (blockHeight + gutterHeight)
  const numStacks = Math.ceil(props.creditBalance / 5)
  // start a new row of stacks every 100 blocks
  const maxWidth = 4 * stackHeightPixels + 3 * gutterHeight;

  const renderBlocks = () => {
    let blocks: JSX.Element[] = [];
    let counter = 0;
    for (let x = 0; x < numStacks; x++) {
      for (let y = 0; y < stackHeightBlocks && counter < props.creditBalance; y++) {
        const fill = (counter < props.creditsRemaining) ? "black" : "none"
        blocks.push(
          <rect
            key={`${counter}`}
            x={`${(strokeWidth + (blockHeight + gutterHeight) * x + Math.floor(x / 5) * gutterHeight) % (maxWidth + gutterHeight)}vw`}
            y={`${strokeWidth + (blockHeight + gutterHeight) * y + Math.floor(counter / 100) * (stackHeightPixels + gutterHeight)}vw`}
            width={`${blockHeight - strokeWidth}vw`}
            height={`${blockHeight - strokeWidth}vw`}
            fill={`${fill}`}
            stroke="black"
            stroke-width={`${strokeWidth}vw`}
          />
        );
        counter++;
      }
    }
    return blocks;
  };

  const blocks = renderBlocks();

  return (
    <svg
      className="blocks"
      width={`${Math.min(maxWidth, numStacks * (blockHeight) + (numStacks - 1) * gutterHeight + 2*strokeWidth + Math.floor(numStacks / 5) * gutterHeight)}vw`}
      height={`${Math.ceil(props.creditBalance / 75) * (stackHeightPixels + gutterHeight)}vw`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {blocks}
    </svg>
  );
}

export default Blocks;
