import { Message } from "@/models/User";

export interface ApiResponse {
  tempUserId: any;
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
};