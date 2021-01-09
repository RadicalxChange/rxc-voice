import { Observable, defer, from } from "rxjs";
import { Conversation } from "../models/Conversation";
import { mapToConversations } from "../utils";

const ROOT_URL = "https://voiceapi.radicalxchange.org";

export const fetchConversations = (): Observable<Conversation[]> => {
  return defer(() => {
    return from<Promise<Conversation[]>>(
      fetch(`${ROOT_URL}/conversations/`)
        .then((res) => res.json())
        .then(mapToConversations),
    );
  });
};
