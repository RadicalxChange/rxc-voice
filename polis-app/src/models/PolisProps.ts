import { Conversation } from "./Conversation";

export interface PolisProps {
  cookies: { [name: string]: any },
  setCookie: any,
  conversations: Conversation[],
  changeColor: any,
}
