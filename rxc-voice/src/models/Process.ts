import { Delegate } from "./Delegate"
import { Stage } from "./Stage"

export interface Process {
  id: number,
  title: string,
  description: string,
  invitation_message: string,
  start_date: string,
  end_date: string,
  delegates: Delegate[],
  stages: Stage[],
  curr_stage: number,
}
