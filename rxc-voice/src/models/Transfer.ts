export interface Transfer {
  id: number,
  sender: string,
  recipient: string,
  date: string,
  amount: number,
  delegation: string,
  user_is_sender: boolean,
}
