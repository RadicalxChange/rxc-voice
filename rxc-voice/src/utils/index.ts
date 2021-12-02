import { Stage, StageType, Delegation, Conversation, Election, MatchPoolMode } from "../models/Stage";
import { Proposal } from "../models/Proposal";
import { Vote } from "../models/Vote";
import { Delegate } from "../models/Delegate"
import { Process } from "../models/Process";
import { Transfer } from "../models/Transfer";
import { User } from "../models/User";
import * as Domain from "./urls";
import { Group } from "../models/Group";
import moment from "moment";

export { Domain };

export const getUserData = (): User | undefined => {
  if (sessionStorage.getItem("user")) {
    return JSON.parse(sessionStorage.getItem("user")!);
  } else {
    return undefined;
  }
};
export const getUserDelegate = (user: User | undefined, process: Process | undefined): Delegate | undefined => {
  return user?.delegates.find((delegate: Delegate) => {
    return delegate.process === process?.id;
  });
}
export const updateCreditBalance = (user: User, process: Process, new_balance: number): User => {
  user.delegates = user.delegates.map((delegate: Delegate) => {
    if (delegate.process === process.id) {
      delegate.credit_balance = new_balance;
    }
    return delegate;
  });
  return user;
}
export const oauthState = sessionStorage.getItem("oauthState");
export const twitterOauthSecret = sessionStorage.getItem("twitterOauthSecret");

export const defaultDelegation: Delegation = {
  id: 0,
  type: StageType.Delegation,
  title: "Delegation",
  description: "",
  start_date: moment().format(),
  end_date: moment().add(1, "days").format(),
  position: 0,
  num_credits: 99,
  allow_transfers: true,
  allow_invites: true,
  match_pool_mode: MatchPoolMode.Default,
}
export const defaultConversation: Conversation = {
  id: 1,
  type: StageType.Conversation,
  title: "Conversation",
  description: "",
  start_date: moment().add(1, "days").format(),
  end_date: moment().add(2, "days").format(),
  position: 1,
  uuid: "",
  show_report: false,
  report_id: "",
}
export const defaultElection: Election = {
  id: 2,
  type: StageType.Election,
  title: "Election",
  description: "",
  start_date: moment().add(3, "days").format(),
  end_date: moment().add(4, "days").format(),
  position: 2,
  negative_votes: true,
  proposals: [],
  show_results: true,
}
export const defaultStages: Stage[] = [defaultDelegation, defaultConversation, defaultElection]

export const mapToProposals = (proposals: Proposal[]): Proposal[] => {
  return proposals.map(mapToProposal);
};

export const mapToProposal = (proposal: Proposal): Proposal => {
  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    link: proposal.link,
    ballot_ratification: proposal.ballot_ratification,
    votes_received: proposal.votes_received,
    credits_received: proposal.credits_received,
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
  return {
    id: transfer.id,
    sender: '',
    recipient: '',
    amount: transfer.amount,
    date: '',
    delegation: transfer.delegation,
    user_is_sender: transfer.user_is_sender,
  };
};

export const mapToDelegates = (delegates: Delegate[]): Delegate[] => {
  return delegates.map(mapToDelegate);
};

export const mapToDelegate = (delegate: Delegate): Delegate => {
  return {
    id: delegate.id,
    profile: delegate.profile,
    credit_balance: delegate.credit_balance,
    pending_credits: delegate.pending_credits,
    process: delegate.process,
  };
};

export const mapToGroups = (groups: Group[]): Group[] => {
  return groups.map(mapToGroup);
};

export const mapToGroup = (group: Group): Group => {
  return {
    id: group.id,
    name: group.name,
    users: group.users,
  };
};

export const mapToDelegation = (stage: any): Delegation => {
  return {
    id: stage.id,
    type: stage.type,
    title: stage.title,
    description: stage.description,
    start_date: stage.start_date,
    end_date: stage.end_date,
    position: stage.position,
    num_credits: stage.num_credits,
    allow_transfers: stage.allow_transfers,
    allow_invites: stage.allow_invites,
    match_pool_mode: stage.matching_pool,
  };
};

export const mapToConversation = (stage: any): Conversation => {
  return {
    id: stage.id,
    type: stage.type,
    title: stage.title,
    description: stage.description,
    start_date: stage.start_date,
    end_date: stage.end_date,
    position: stage.position,
    uuid: stage.uuid,
    show_report: stage.show_report,
    report_id: stage.report_id,
  };
};

export const mapToElection = (stage: any): Election => {
  return {
    id: stage.id,
    type: stage.type,
    title: stage.title,
    description: stage.description,
    start_date: stage.start_date,
    end_date: stage.end_date,
    position: stage.position,
    negative_votes: stage.negative_votes,
    proposals: stage.proposals,
    show_results: stage.show_results,
  };
};

export const mapToStages = (stages: any[]): Stage[] => {
  return stages.map(mapToStage);
};

export const mapToStage = (stage: any): Stage => {
  switch (stage.type) {
    case StageType.Delegation:
      return mapToDelegation(stage);
    case StageType.Conversation:
      return mapToConversation(stage);
    case StageType.Election:
      return mapToElection(stage);
    default:
      return {
        id: stage.id,
        type: stage.type,
        title: stage.title,
        description: stage.description,
        start_date: stage.start_date,
        end_date: stage.end_date,
        position: stage.position,
      };
  }
};

export const mapToProcesses = (processes: any[]): Process[] => {
  if (processes.length) {
    return processes.map(mapToProcess);
  } else {
    return processes;
  }
};

export const mapToProcess = (process: any): Process => {
  return {
    id: process.id,
    title: process.title,
    description: process.description,
    invitation_message: process.invitation_message,
    start_date: process.start_date,
    end_date: process.end_date,
    delegates: mapToDelegates(process.delegates).filter(delegate => delegate.profile.is_verified),
    stages: mapToStages(process.stages),
    curr_stage: process.curr_stage,
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

export const validateEmail = (email: string | undefined) => {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email ? re.test(email) : false;
};

export const validatePasswordLength = (password: string) => {
  if (password.length >= 8) {
    return true;
  }
  return false;
};
