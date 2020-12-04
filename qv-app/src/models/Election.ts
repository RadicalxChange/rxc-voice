import { Proposal } from "./Proposal"

export interface Election {
  id: number,
  title: string,
  description: string,
  start_date: string,
  end_date: string,
  negative_votes: boolean,
  matching_fund: number,
  vote_token: string,
  num_tokens: number,
  proposals: Proposal[],
  show_results: boolean,
}
