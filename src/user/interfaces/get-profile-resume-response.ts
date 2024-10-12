export interface getProfileResumeResponse {
  user: {
    fullName: string;
    username: string;
    country: string;
    email: string;
  };
  totalFunds: number;
  accounts: { accountId: number; currency: string }[];
}
