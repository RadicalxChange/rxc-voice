import { Delegate } from "./Delegate";

export interface User {
  token: string,
  id: number,
  is_verified: boolean,
  user_id: number,
  username: string,
  email: string,
  public_username: string,
  first_name: string,
  last_name: string,
  profile_pic: string,
  delegates: Delegate[],
}
