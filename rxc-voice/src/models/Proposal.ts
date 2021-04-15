export interface Proposal {
  id: number,
  title: string,
  description: string,
  link: string,
  ballot_ratification: boolean,
  votes_received: number,
}
