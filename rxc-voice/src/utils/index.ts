import { Election } from "../models/Election";
import { Proposal } from "../models/Proposal";
import { Vote } from "../models/Vote";
import { Voter } from "../models/Voter";
import { Permission } from "../models/Permission";
import { Process } from "../models/Process";

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
  show_results: false,
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

export const mapToProcesses = (processes: Process[]): Process[] => {
  return processes.map(mapToProcess);
};

export const mapToProcess = (process: Process): Process => {
  return {
    id: process.id,
    title: process.title,
    description: process.description,
    start_date: process.start_date,
    end_date: process.end_date,
    delegates: process.delegates,
    matching_pool: process.matching_pool,
    conversation: process.conversation,
    curation_info: process.curation_info,
    top_posts: process.top_posts,
    election: process.election,
  };
};
