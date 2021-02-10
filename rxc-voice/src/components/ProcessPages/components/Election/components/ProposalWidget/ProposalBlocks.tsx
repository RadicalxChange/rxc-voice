import React from "react";

function ProposalBlocks(props: any) {
  const blockHeightPixels = (window.innerWidth > 768) ? 12 : 6;
  const gutterHeightPixels = (window.innerWidth > 768) ? 4 : 4;
  const totalHeightBlocks = Math.sqrt(props.cost)
  const totalHeightPixels = totalHeightBlocks * blockHeightPixels + (totalHeightBlocks - 1) * gutterHeightPixels;
  type position = [number, number];

  const renderBlocks = () => {
    let blocks: JSX.Element[] = [];
    for (let y = 0; y < totalHeightBlocks; y++) {
      for (let x = 0; x < totalHeightBlocks; x++) {
        blocks.push(
          <rect x={`${(blockHeightPixels + gutterHeightPixels) * x}`} y={`${(blockHeightPixels + gutterHeightPixels) * y}`} width={`${blockHeightPixels}`} height={`${blockHeightPixels}`} fill="black" stroke="black" />
        );
      }
    }
    return blocks;
  };

  const blocks = renderBlocks();

  return (
    <svg className="blocks" width={`${totalHeightPixels}`} height={`${totalHeightPixels}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {blocks}
    </svg>
  );
}

export default ProposalBlocks;
