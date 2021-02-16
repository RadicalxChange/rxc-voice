import { Election } from "../models/Election";
import { Proposal } from "../models/Proposal";
import { Vote } from "../models/Vote";
import { Voter } from "../models/Voter";
import { Delegate } from "../models/Delegate"
import { Permission } from "../models/Permission";
import { Process } from "../models/Process";
import { Status } from "../models/Status";
import intro from '../assets/bars/bar_introduction.svg';
import delg from '../assets/bars/bar_delegation.svg';
import delb from '../assets/bars/bar_deliberation.svg';
import cur from '../assets/bars/bar_curation.svg';
import intro_white from '../assets/bars/bar_introduction_white.svg';
import delg_white from '../assets/bars/bar_delegation_white.svg';
import delb_white from '../assets/bars/bar_deliberation_white.svg';
import cur_white from '../assets/bars/bar_curation_white.svg';
import elec from '../assets/bars/bar_election.svg';
import { Transfer } from "../models/Transfer";

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

export const standInProcess = {
  id: 0,
  title: 'loading process...',
  description: '',
  start_date: '',
  end_date: '',
  delegates: new Array<Delegate>(),
  matching_pool: 0,
  conversation: {},
  curation_info: '',
  top_posts: new Array<string>(),
  election: {},
  status: Status.Introduction,
}

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
    sum_contributions: proposal.sum_contributions,
    num_contributors: proposal.num_contributors,
    current_match: proposal.current_match,
    votes_received: proposal.votes_received,
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

export const mapToTransfers = (transfers: any[]): Transfer[] => {
  return transfers.map(mapToTransfer);
};

export const mapToTransfer = (transfer: any): Transfer => {
  console.log(transfer);
  return {
    id: transfer.id,
    sender: '',
    recipient: '',
    amount: transfer.amount,
    date: '',
    process: transfer.process,
    user_is_sender: transfer.user_is_sender,
  };
};

export const mapToDelegates = (delegates: Delegate[]): Delegate[] => {
  return delegates.map(mapToDelegate);
};

export const mapToDelegate = (delegate: Delegate): Delegate => {
  return {
    id: delegate.id,
    user: delegate.user,
    public_username: delegate.public_username,
    credit_balance: delegate.credit_balance
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
    delegates: mapToDelegates(process.delegates).filter(delegate => delegate.user.is_active),
    matching_pool: process.matching_pool,
    conversation: process.conversation,
    curation_info: process.curation_info,
    top_posts: process.top_posts,
    election: process.election,
    status: process.status,
  };
};

export const containsSpecialCharacters = (str: string) => {
  // eslint-disable-next-line
  const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return format.test(str);
};

export const containsLowerCase = (str: string) => {
  // eslint-disable-next-line
  return /[a-z]/.test(str);
};

export const containsUpperCase = (str: string) => {
  // eslint-disable-next-line
  return /[A-Z]/.test(str);
};

export const containsNumber = (str: string) => {
  // eslint-disable-next-line
  return /\d/.test(str);
};

export const validateEmail = (email: string) => {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validatePasswordLength = (password: string) => {
  if (password.length >= 8) {
    return true;
  }
  return false;
};

export const getDelegateId = (user: any) => {
  if (user) {
    return user.id;
  } else {
    return undefined;
  }
};

export const getUserId = (user: any) => {
  if (user) {
    return user.user_id;
  } else {
    return undefined;
  }
};

export const getTitle = (process: Process | null) => {
  if (process) {
    return process.title;
  } else {
    return undefined;
  }
};

export const getId = (process: Process | null) => {
  if (process) {
    return process.id;
  } else {
    return undefined;
  }
};

export const getConversation = (process: Process | null) => {
  if (process) {
    return process.conversation;
  } else {
    return undefined;
  }
};

export const getElection = (process: Process | null) => {
  if (process) {
    return process.election;
  } else {
    return undefined;
  }
};

export const getEndDate = (process: Process | null) => {
  if (process) {
    return process.end_date;
  } else {
    return undefined;
  }
};

export const getStatus = (process: Process | null) => {
  if (process) {
    return process.status;
  } else {
    return undefined;
  }
};

export const getRecipient = (transferData: any) => {
  if (transferData) {
    return transferData.recipient;
  } else {
    return null;
  }
};

export const getStatusBar = (process: Process | null, color: string) => {
  if (process) {
    if (color === "var(--whiteColor)") {
      switch (process.status) {
        case Status.Introduction: {
          return intro_white;
        }
        case Status.Delegation: {
          return delg_white;
        }
        case Status.Deliberation: {
          return delb_white;
        }
        case Status.Curation: {
          return cur_white;
        }
        case Status.Election: {
          return elec;
        }
        case undefined: {
          return undefined;
        }
      }
    } else {
      switch (process.status) {
        case Status.Introduction: {
          return intro;
        }
        case Status.Delegation: {
          return delg;
        }
        case Status.Deliberation: {
          return delb;
        }
        case Status.Curation: {
          return cur;
        }
        case Status.Election: {
          return elec;
        }
        case undefined: {
          return undefined;
        }
      }
    }
  } else {
    return undefined;
  }
};
