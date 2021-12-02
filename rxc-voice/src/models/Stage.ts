import { Proposal } from "./Proposal"

export interface Stage {
  id: number,
  type: StageType,
  title: string,
  description: string,
  start_date: string,
  end_date: string,
  position: number,
}

export interface Delegation extends Stage {
  num_credits: number,
  allow_transfers: boolean,
  allow_invites: boolean,
  match_pool_mode: MatchPoolMode,
}

export interface Conversation extends Stage {
  uuid: string,
  show_report: boolean,
  report_id: string,
}

export interface Election extends Stage {
  negative_votes: boolean,
  proposals?: Proposal[],
  show_results: boolean,
}

export enum StageType {
  Delegation = 'delg',
  Conversation = 'conv',
  Election = 'elec',
  Custom = 'cust',
}

export enum MatchPoolMode {
  None = 'none',
  Default = 'default',
  Infinite = 'infinite',
}
