export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  category: string;
  isAdjusting?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
  transactionId: string;
}

export interface LedgerEntry {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}
