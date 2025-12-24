export type ChatbotStatus = "active" | "archived" | "pending" | "failed";

export interface Chatbot {
  id: string;
  name: string;
  status: ChatbotStatus;
}
