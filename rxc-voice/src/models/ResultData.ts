import { Proposal } from "./Proposal";

export interface ResultData {
  proposals: Proposal[],
  highestProposal: number,
  lowestProposal: number,
}
