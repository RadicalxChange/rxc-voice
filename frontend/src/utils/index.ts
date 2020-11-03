import { Election } from "../models/Election";
import { Proposal } from "../models/Proposal";

export const standInElection = (): Election => ({
  id: '',
  title: 'loading election...',
  description: '',
  start_date: '',
  end_date: '',
  negative_votes: true,
  matching_fund: 0,
  vote_token: '',
  num_tokens: 0,
  proposals: new Array<Proposal>(),
});

export const mapToProposals = (proposals: Proposal[]): Proposal[] => {
  return proposals.map(mapToProposal);
};

export const mapToProposal = (proposal: Proposal): Proposal => {
  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    link: proposal.link,
  };
};
