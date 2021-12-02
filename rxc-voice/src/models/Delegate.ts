import { Profile } from "./Profile";

export interface Delegate {
  id: number,
  profile: Profile,
  credit_balance: number,
  pending_credits: number,
  process: number,
}
