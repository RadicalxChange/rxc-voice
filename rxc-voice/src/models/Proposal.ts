export interface Proposal {
  id: number,
  title: string,
  description: string,
  link: string,
  sum_contributions: number,
  num_contributors: number,
  current_match: number,
  votes_received: number,
}
