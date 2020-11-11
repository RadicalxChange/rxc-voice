import { Election } from "../models/Election";
import { Proposal } from "../models/Proposal";
import { Vote } from "../models/Vote";
import { Voter } from "../models/Voter";
import { Permission } from "../models/Permission";

export const standInElection = (): Election => ({
  id: 0,
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

export const standInVoter = (): Voter => ({
  id: 0,
  email: '',
  password: '',
});

export const defaultPermission = (): Permission => (Permission.None);

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

export const mapToVotes = (votes: Vote[]): Vote[] => {
  return votes.map(mapToVote);
};

export const mapToVote = (vote: Vote): Vote => {
  return {
    id: vote.id,
    sender: vote.sender,
    proposal: vote.proposal,
    amount: vote.amount,
    date: vote.date,
  };
};

export const mapToVoters = (voters: Voter[]): Voter[] => {
  return voters.map(mapToVoter);
};

export const mapToVoter = (voter: Voter): Voter => {
  return {
    id: voter.id,
    email: voter.email,
    password: voter.password,
  };
};
