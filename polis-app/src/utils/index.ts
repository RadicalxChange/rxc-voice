import { Conversation } from "../models/Conversation";

export const mapToConversations = (
  conversations: Conversation[]): Conversation[] => {
  return conversations.map(mapToConversations);
};

export const mapToConversation = (conversation: Conversation): Conversation => {
  return {
    id: conversation.id,
    title: conversation.title,
    description: conversation.description,
    start_date: conversation.start_date,
    end_date: conversation.end_date,
  };
};
