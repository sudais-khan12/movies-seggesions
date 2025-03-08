export type EmailServiceProvider = "Gmail" | "Outlook" | "Imap";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from: string;
}

export interface ApiResponse {
  id?: string;
  success: boolean;
  userName: string;
  email: string;
  message: string;
}
