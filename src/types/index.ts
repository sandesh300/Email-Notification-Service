export interface Email {
    to: string;
    subject: string;
    body: string;
  }
  
  export interface EmailStatus {
    id: string;
    email: Email;
    status: 'pending' | 'sent' | 'failed';
    attempts: number;
    lastAttempt: Date | null;
  }