import { Conversation } from "./Conversation"
import { Delegate } from "./Delegate"
import { Election } from "./Election"
import { Status } from "./Status"

export interface Process {
  id: number,
  title: string,
  description: string,
  start_date: string,
  end_date: string,
  delegates: Delegate[],
  matching_pool: number,
  conversation: Conversation,
  curation_info: string,
  top_posts: string[],
  election: Election,
  status: Status,
}
