import React from "react";

function ProposalBlocks(props: any) {
  const blockHeightPixels = (window.innerWidth > 768) ? .7 : 1.2;
  const gutterHeightPixels = (window.innerWidth > 768) ? .5 : .9;
  const totalHeightBlocks = Math.sqrt(props.cost)
  const totalHeightPixels = (props.cost !== 0) ? (
    totalHeightBlocks * blockHeightPixels + (totalHeightBlocks - 1) * gutterHeightPixels
  ) : (
    0
  );

  const renderBlocks = () => {
    let blocks: JSX.Element[] = [];
    let counter = 0;
    for (let y = 0; y < totalHeightBlocks; y++) {
      for (let x = 0; x < totalHeightBlocks; x++) {
        blocks.push(
          <rect
            key={`${counter}`}
            x={`${(blockHeightPixels + gutterHeightPixels) * x}vw`}
            y={`${(blockHeightPixels + gutterHeightPixels) * y}vw`}
            width={`${blockHeightPixels}vw`}
            height={`${blockHeightPixels}vw`}
            fill="black"
            stroke="black"
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
      width={`${totalHeightPixels}vw`}
      height={`${totalHeightPixels}vw`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {blocks}
    </svg>
  );
}

export default ProposalBlocks;
