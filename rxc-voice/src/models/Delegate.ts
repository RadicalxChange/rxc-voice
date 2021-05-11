export interface Delegate {
  id: number,
  is_verified: boolean,
  user: any,
  public_username: string,
  oauth_provider: string,
  credit_balance: number,
  pending_credits: number,
}
