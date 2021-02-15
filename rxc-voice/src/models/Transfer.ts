export interface Transfer {
  id: number,
  sender: string,
  recipient: string,
  date: string,
  amount: number,
  process: string,
  user_is_sender: boolean,
}
