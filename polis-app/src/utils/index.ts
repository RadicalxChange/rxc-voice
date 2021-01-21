import { Conversation } from "../models/Conversation";

export const mapToConversations = (conversations: Conversation[]): Conversation[] => {
  return conversations.map(mapToConversation);
};

export const mapToConversation = (conversation: Conversation): Conversation => {
  return {
    id: conversation.id,
    uuid: conversation.uuid,
    title: conversation.title,
    description: conversation.description,
    start_date: conversation.start_date,
    end_date: conversation.end_date,
    show_report: conversation.show_report,
    report_id: conversation.report_id,
  };
};
